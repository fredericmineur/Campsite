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
    for (let i = 0; i<300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random()*20) +10;
        const camp = new Campground({
            author: '60a63d8f21d49d2554d59788',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            geometry:{"coordinates":[cities[random1000].longitude,cities[random1000].latitude],"type":"Point"},
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                  url: 'https://res.cloudinary.com/djllqmzjg/image/upload/v1622535989/CampSite/wipix69fa7ltmguutuwg.jpg',
                  filename: 'CampSite/wipix69fa7ltmguutuwg'
                },
                {
                  url: 'https://res.cloudinary.com/djllqmzjg/image/upload/v1622031109/CampSite/trfoxyf22vpxsg5btpr2.jpg',
                  filename: 'CampSite/trfoxyf22vpxsg5btpr2'
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