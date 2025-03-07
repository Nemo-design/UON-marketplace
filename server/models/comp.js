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
    }
});

const compModel = mongoose.model('comp', compSchema);

module.exports = compModel;