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
    image: {
        type: String, // Store the image URL or Base64 string
        required: false // Changed to false to make it optional
    },
    category: {
        type: String,
        required: true,
        enum: [
            'Electronics',
            'Furniture',
            'Clothing',
            'Books',
            'Sports',
            'Vehicles',
            'Toys',
            'Home Appliances',
            'Beauty',
            'Pets'
        ]
    },
    createdAt: {
        type: Date,
        default: Date.now // Add timestamp for when listing is created
    }
});

const listingModel = mongoose.model('listing', listingSchema);

module.exports = listingModel;