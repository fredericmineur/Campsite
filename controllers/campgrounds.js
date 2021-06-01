const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary');
const mbxGecoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGecoding({accessToken:process.env.MAPBOX_TOKEN})


module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderCampgroundCreateForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
    const geodataResponse = await geocodingClient.forwardGeocode({
        query: req.body.campground.location,
        limit:1
    }).send();
    const campground = new Campground(req.body.campground);
    campground.geometry = geodataResponse.body.features[0].geometry
    campground.author = req.user._id;
    campground.images = req.files.map((file)=>{return {url: file.path, filename: file.filename}})
    await campground.save();
    console.log(campground);
    req.flash('success', 'The campground has been successfully created');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
        .populate({
            path:'reviews', 
            populate :{
                path: 'author'
            }
        })
        .populate('author');
    if (!campground) {
        req.flash('error', 'Campground could not be found');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground })
}

module.exports.renderCampgroundEditForm = async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Campground could not be found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.editCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    await Campground.findByIdAndUpdate(id,
        { ...req.body.campground }, { runValidators: true, new: true, useFindAndModify: false });
    const newImages = req.files.map((file)=>{return {url: file.path, filename: file.filename}});
    campground.images.push(...newImages);
    const geodataResponse = await geocodingClient.forwardGeocode({
        query: req.body.campground.location,
        limit:1
    }).send();
    campground.geometry = geodataResponse.body.features[0].geometry

    await campground.save();
    if (req.body.deleteImages){
        for (let filename of req.body.deleteImages){
            cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
    }
    req.flash('success', 'The campground has been successfully updated');
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteCampground = async (req, res, next) => {
    const campground = await Campground.findOne({_id:req.params.id}, 'title');
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', `Campground "${campground.title}" deleted`);
    res.redirect('/campgrounds');
}