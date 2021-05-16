const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
// const { render } = require('ejs');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');

const { campgroundSchema, reviewSchema } = require('./schemas');
const Campground = require('./models/campground');
const Review = require('./models/review');
const ExpressError = require('./utils/ExpressError');
const campgroundRoutes = require('./routes/campground');
const reviewRoutes = require('./routes/review');

mongoose.connect('mongodb://localhost:27017/camp-site', {
    useNewUrlParser: true,
    // userCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error "));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();



app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes );

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        next(new ExpressError(msg, 400));
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        next(new ExpressError(msg, 400));
    } else {
        next();
    }
}



app.get('/', (req, res) => {
    res.render('home');
})




//CAMPGROUNDS




//REVIEWS



app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    res.status(statusCode).render('error', { err });
})


app.listen(3000, () => { console.log('Serving on port 3000') })