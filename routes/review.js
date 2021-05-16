const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Review = require('../models/review');
const { reviewSchema } = require('../schemas');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        next(new ExpressError(msg, 400));
    } else {
        next();
    }
}

router.post('/', validateReview, catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:idReview', catchAsync(async (req, res, next) => {
    const { id, idReview } = req.params;
    await Campground.findByIdAndUpdate(id, {$pull:{reviews: idReview}},{useFindAndModify:false} );
    await Review.findByIdAndDelete(idReview);
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;