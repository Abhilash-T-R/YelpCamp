const mongoose = require('mongoose');
const cities = require('./cities');
const {places,descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
.then(() => console.log('Connected to DB'))
.catch(err => console.error(err));

const sample = (array)=>{
    return array[Math.floor(Math.random()*array.length)];
}

const seedDB = async ()=>{
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            author: '6714b627412c76839d0f0f99',
            location: `${cities[random1000].city},${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor',
            price,
            image: [
              {
                url: 'https://res.cloudinary.com/dcj8klewk/image/upload/v1731592868/YelpCamp/nvmnpjdclphubq8dqje3.jpg',
                filename: 'YelpCamp/nvmnpjdclphubq8dqje3',
              },
              {
                url: 'https://res.cloudinary.com/dcj8klewk/image/upload/v1731592871/YelpCamp/bckuqaz4nlxgr76px8rb.jpg',
                filename: 'YelpCamp/bckuqaz4nlxgr76px8rb',
              }
            ]
        })
        await camp.save();
    }
}
seedDB()
.then(()=>{
    mongoose.connection.close();
})