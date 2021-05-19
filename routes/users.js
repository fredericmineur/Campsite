const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
// const { route } = require('./campgrounds');

router.get('/register', (req, res) =>{
    res.render('users/register');
})

router.post('/register', catchAsync (async (req, res)=>{
    try{
        const {username, email, password} = req.body;
        const user = new User({username, email});
        const registeredUser = await User.register(user, password);
        console.log(registeredUser);
        req.flash('success', 'welcome to Campground');
        res.redirect('/campgrounds');
    }catch(e){
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));

router.get('/login', (req, res) =>{
    res.render('users/login')
});

router.post('/login', 
    passport.authenticate('local', 
        {failureRedirect:'/login', failureFlash:'invalid credentials'}),
    (req, res) =>{
        res.redirect('/campgrounds');
})

module.exports = router;