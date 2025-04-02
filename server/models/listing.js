const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    /*,
    image: {
        type: String,
        required: true
    }*/
});

const listingModel = mongoose.model('listing', listingSchema);

module.exports = listingModel;