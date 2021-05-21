const express = require('express');
const router = express.Router();
const campgroundController = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isCampgroundAuthor, validateCampground } = require('../middleware');

router.route('/')
    .get(catchAsync(campgroundController.index))
    .post(isLoggedIn, validateCampground, 
        catchAsync(campgroundController.createCampground));
    
router.get('/new', isLoggedIn, 
    campgroundController.renderCampgroundCreateForm);

router.route('/:id')
    .get(catchAsync(campgroundController.showCampground))
    .put(isLoggedIn, isCampgroundAuthor, validateCampground, 
        catchAsync(campgroundController.editCampground))
    .delete(isLoggedIn, isCampgroundAuthor, 
        campgroundController.deleteCampground);

router.get('/:id/edit', isLoggedIn, isCampgroundAuthor, 
    catchAsync(campgroundController.renderCampgroundEditForm));

module.exports = router;