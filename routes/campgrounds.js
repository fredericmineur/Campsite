const express = require('express');
const router = express.Router();
const campgroundController = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isCampgroundAuthor, validateCampground } = require('../middleware');

const multer  = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({ storage: storage });

router.route('/')
    .get(catchAsync(campgroundController.index))
    // .post(isLoggedIn, validateCampground, 
    //     catchAsync(campgroundController.createCampground));
    // .post(upload.array('image'), (req, res)=>{
    //     console.log(req.body);
    //     console.log(req.files);
    //     res.send('sent');
    // });
    .post(isLoggedIn, upload.array('images'), validateCampground, 
        catchAsync(campgroundController.createCampground)
    )


router.get('/new', isLoggedIn,
    campgroundController.renderCampgroundCreateForm);
// router.get('/new', isLoggedIn, 
//     campgroundController.renderCampgroundCreateForm);

router.route('/:id')
    .get(catchAsync(campgroundController.showCampground))
    .put(isLoggedIn, isCampgroundAuthor, upload.array('images'), validateCampground, 
        catchAsync(campgroundController.editCampground))
    .delete(isLoggedIn, isCampgroundAuthor, 
        campgroundController.deleteCampground);

router.get('/:id/edit', isLoggedIn, isCampgroundAuthor, 
    catchAsync(campgroundController.renderCampgroundEditForm));

module.exports = router;