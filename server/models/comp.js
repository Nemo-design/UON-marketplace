const mongoose = require('mongoose');

const compSchema = new mongoose.Schema({
    Username: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    Phone: {
        type: String
    },
    Address: {
        type: String
    },
    Favourites: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'listing', // Reference to the listing model
        }
    ],
});

const compModel = mongoose.model('comp', compSchema);

module.exports = compModel;