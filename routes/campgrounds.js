const express = require('express');
const router = express.Router();
const campgroundController = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isCampgroundAuthor, validateCampground } = require('../middleware');

router.get('/', catchAsync(campgroundController.index));

router.get('/new', isLoggedIn, 
    campgroundController.renderCampgroundCreateForm);

router.post('/', isLoggedIn, validateCampground, 
    catchAsync(campgroundController.createCampground));

router.get('/:id', catchAsync(campgroundController.showCampground))

router.get('/:id/edit', isLoggedIn, isCampgroundAuthor, 
    catchAsync(campgroundController.renderCampgroundEditForm))

router.put('/:id', isLoggedIn, isCampgroundAuthor, validateCampground, 
    catchAsync(campgroundController.editCampground))

router.delete('/:id', isLoggedIn, isCampgroundAuthor, 
    campgroundController.deleteCampground)

module.exports = router;