const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const methodOverride = require('method-override');
const flash = require('connect-flash');
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

app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(flash());

const sessionOptions = {
    secret: 'secretcampground',
    resave: false,
    saveUninitialized: true,
    cookie : {
        httpOnly: true,
        expires: Date.now() + 1000 + 60 * 60 * 24 *7,
        maxAge: 1000 + 60 * 60 * 24 *7
    }
}

app.use(session(sessionOptions));


app.use((req, res, next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes );



app.get('/', (req, res) => {
    res.render('home');
})




app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    // req.flash('error', err.message)
    res.status(statusCode).render('error', { err });
})


app.listen(3000, () => { console.log('Serving on port 3000') })