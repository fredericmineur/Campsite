const Campground = require('../models/campground');
const Review = require('../models/review');


module.exports.createReview = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'New review created');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async (req, res, next) => {
    const { id, idReview } = req.params;
    await Campground.findByIdAndUpdate(id, {$pull:{reviews: idReview}},{useFindAndModify:false} );
    await Review.findByIdAndDelete(idReview);
    req.flash('success', 'Review deleted');
    res.redirect(`/campgrounds/${id}`);
}