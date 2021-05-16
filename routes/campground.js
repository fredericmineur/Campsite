const express = require('express');
const router = express.Router();

const Campground = require('../models/campground');
const { campgroundSchema} = require('../schemas');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        next(new ExpressError(msg, 400));
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}))

router.get('/new', (req, res) => {
    res.render('campgrounds/new');
})

router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    console.dir(req.body.campground);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.get('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    res.render('campgrounds/show', { campground })
}))

router.get('/:id/edit', catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}))

router.put('/:id', validateCampground, catchAsync(async (req, res, next) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id,
        { ...req.body.campground }, { runValidators: true, new: true, useFindAndModify: false });
    res.redirect(`/campgrounds/${req.params.id}`);
}))

router.delete('/:id', async (req, res, next) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect('/campgrounds');
})


module.exports = router;