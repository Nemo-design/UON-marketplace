const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    itle: {
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
    image: {
        type: String,
        required: true
    }
});

const listingModel = mongoose.model('listing', listingSchema);

module.exports = listingModel;