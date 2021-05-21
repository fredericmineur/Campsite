const express = require('express');
const passport = require('passport');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const userController = require('../controllers/users');

router.route('/register')
    .get(userController.renderRegisterForm)
    .post(catchAsync(userController.register));

router.route('/login')
    .get(userController.renderLogin)
    .post(passport.authenticate('local',
            { failureRedirect: '/login', 
            failureFlash: 'invalid credentials' }),
        userController.login)

router.get('/logout', userController.logout)

module.exports = router;