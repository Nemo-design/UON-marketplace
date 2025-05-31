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
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comp', // Reference to the User model
        required: true,
    },
    price: {
        type: Number,
        min: 0, // Minimum price is 0 so no negatives
        max: 10000000000, 
        required: true
    },
    username: {
        type: String,
        required: true
    },
    images: [{
        type: String, // Store the image URL or Base64 string
        required: false // Changed to false to make it optional
    }],
    // messages is an array of ObjectId references to the Message model
messengers: {
  type: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'messenger',
    },
  ],
  default: [], // Default value is an empty array
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