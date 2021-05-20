const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Review = require('../models/review');
const catchAsync = require('../utils/catchAsync');
const {validateReview} = require('../middleware');



router.post('/', validateReview, catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'New review created');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:idReview', catchAsync(async (req, res, next) => {
    const { id, idReview } = req.params;
    await Campground.findByIdAndUpdate(id, {$pull:{reviews: idReview}},{useFindAndModify:false} );
    await Review.findByIdAndDelete(idReview);
    req.flash('success', 'Review deleted');
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;