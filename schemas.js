const Joi = require('joi');

module.exports.campgroundSchema = Joi.object({
    campground : Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        // image: Joi.string().uri().required(),
        images: Joi.array().items(Joi.object({
            url: Joi.string().uri().required(),
            filename: Joi.string().required()
        })),
        description: Joi.string().required(),
        location: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
});
//https://stackoverflow.com/questions/42656549/joi-validation-of-array/42656623#42656623

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})