const mongoose = require('mongoose');

const messengerSchema = new mongoose.Schema({
  senderId: {
    type: String,
    required: true,
  },
  receiverId: {
    type: String,
    required: true,
  },
 listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'listing', // Reference to the listing model
    required: true,
  },
 messages: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'message',
  },
],
});

const messengerModel = mongoose.model('messenger', messengerSchema);

module.exports = messengerModel;