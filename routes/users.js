const express = require('express');
const passport = require('passport');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const userController = require('../controllers/users');

router.get('/register', userController.renderRegisterForm);

router.post('/register', catchAsync(userController.register));

router.get('/login', userController.renderLogin);

router.post('/login',
    passport.authenticate('local',
        { failureRedirect: '/login', 
        failureFlash: 'invalid credentials' }),
    userController.login)

router.get('/logout', userController.logout)

module.exports = router;