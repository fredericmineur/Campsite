const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');
const review = require('../models/review');

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

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({});
    await review.deleteMany({});
    for (let i = 0; i<50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random()*20) +10;
        const camp = new Campground({
            author: '60a63d8f21d49d2554d59788',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            geometry:{"coordinates":[-1.37889,46.03278],"type":"Point"},
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                  url: 'https://res.cloudinary.com/djllqmzjg/image/upload/v1621891665/CampSite/i8undqddchurg1yrnfas.jpg',
                  filename: 'CampSite/i8undqddchurg1yrnfas'
                },
                {
                  url: 'https://res.cloudinary.com/djllqmzjg/image/upload/v1621891665/CampSite/phtgcmc8g2bnapyhzaz9.jpg',
                  filename: 'CampSite/phtgcmc8g2bnapyhzaz9'
                }
              ],
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis hic iste commodi animi laudantium, eum nostrum ex sit perferendis, atque mollitia tenetur quam recusandae sapiente dolor? Veniam expedita cupiditate ipsam.',
            price
        })
        await camp.save();
    }
}


seedDB().then(() => {
    mongoose.connection.close();
});