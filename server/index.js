const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const compModel = require('./models/comp');
const listingModel = require('./models/listing');
const messageModel = require('./models/message');
const messengerModel = require('./models/messenger');
const authMiddleware = require('./middleware/authMiddleware');


const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(cors());

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// MongoDB connection
mongoose.connect('mongodb+srv://Comp3851:comp3851b@cluster0.csaho.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const user = await compModel.findOne({ Email });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (user.Password !== Password) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    
    const token = jwt.sign(
      { _id: user._id, username: user.Username },
      'your_jwt_secret',
      { expiresIn: '24h' }
    );
    
    res.json({ token, username: user.Username, userId: user._id });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// Register endpoint
app.post('/register', async (req, res) => {
  try {
    const newUser = await compModel.create(req.body);
    res.json(newUser);
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
});

// Messenger endpoint creates new messenger on intial message regarding a listing
app.post('/messenger', async (req, res) => {
  try {
    const { listingId } = req.body;
    const newMessenger = await messengerModel.create({ listingId });
    res.json(newMessenger);
  } catch (err) {
    console.error('Messenger error:', err);
    res.status(500).json({ error: 'Messenger creation failed', details: err.message });
  }
});

app.post('/Message', async (req, res) => {
  try {
    const newMessenger = await messengerModelModel.create(req.body);
    res.json(newMessenger);
  } catch (err) {
    console.error('Message error:', err);
    res.status(500).json({ error: 'Message failed', details: err.message });
  }
});

// Get all listings (no auth required)
app.get('/listings/all', async (req, res) => {
  try {
    const listings = await listingModel.find().sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    console.error('Error fetching all listings:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// Upload a new listing
app.post('/upload', authMiddleware(false), upload.single('image'), async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    
    // Validate required fields
    if (!title || !description || !price || !category) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: 'Title, description, price, and category are required'
      });
    }

    // Create listing object
    const listingData = {
      title,
      description,
      ownerId: req.user._id,
      price,
      category,
      username: req.user ? req.user.username : 'Anonymous',
      createdAt: new Date()
    };

    // Add image if provided
    if (req.file) {
      listingData.image = req.file.buffer.toString('base64');
    }

    // Save to database
    const newListing = await listingModel.create(listingData);
    console.log('New listing created:', newListing._id);

    res.status(201).json({ 
      message: 'Listing created successfully',
      data: newListing 
    });
  } catch (err) {
    console.error('Error creating listing:', err);
    res.status(500).json({ 
      error: 'Failed to create listing',
      details: err.message 
    });
  }
});
// Get a single listing by ID
app.get('/listings/id/:id', async (req, res) => {
  try {
    const listing = await listingModel.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json(listing);
  } catch (err) {
    console.error('Error fetching listing:', err);
    res.status(500).json({ error: 'Failed to fetch listing', details: err.message });
  }
});
// Edit a listing
app.put('/listings/id/:id', authMiddleware(false), upload.single('image'), async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    const updateData = { title, description, price, category };
    
    if (req.file) {
      updateData.image = req.file.buffer.toString('base64');
    }

    const updatedListing = await listingModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedListing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json(updatedListing);
  } catch (err) {
    console.error('Error updating listing:', err);
    res.status(500).json({ error: 'Failed to update listing', details: err.message });
  }
});


// Get listings by category
app.get('/listings/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const listings = await listingModel.find({ 
      category: { 
        $regex: new RegExp(category, 'i') 
      }
    }).sort({ createdAt: -1 });
    
    res.json(listings);
  } catch (err) {
    console.error(`Error fetching ${req.params.category} listings:`, err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});
// Delete a listing
app.delete('/listings/:id', authMiddleware(false), async (req, res) => {
  try {
    const listing = await listingModel.findByIdAndDelete(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json({ message: 'Listing deleted successfully' });
  } catch (err) {
    console.error('Error deleting listing:', err);
    res.status(500).json({ error: 'Failed to delete listing', details: err.message });
  }
});

// Edit a listing
app.put('/listings/:id', authMiddleware(false), upload.single('image'), async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    const updateData = { title, description, price, category };
    
    if (req.file) {
      updateData.image = req.file.buffer.toString('base64');
    }

    const updatedListing = await listingModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedListing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json(updatedListing);
  } catch (err) {
    console.error('Error updating listing:', err);
    res.status(500).json({ error: 'Failed to update listing', details: err.message });
  }
});

// Get user's listings
app.get('/my-listings', authMiddleware(true), async (req, res) => {
  try {
    const listings = await listingModel.find({ 
      username: req.user.username 
    }).sort({ createdAt: -1 });
    
    res.json(listings);
  } catch (err) {
    console.error('Error fetching user listings:', err);
    res.status(500).json({ error: 'Failed to fetch listings', details: err.message });
  }
});

//delete message
const handleDeleteChat = async (messengerId) => {
  if (!window.confirm('Are you sure you want to delete this conversation?')) return;
  const token = localStorage.getItem('token');
  try {
    await axios.delete(
        `http://localhost:3001/messages/delete-chat/${messengerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    setMessengers(messengers.filter((m) => m._id !== messengerId));
    setSelectedMessenger(null);
  } catch (err) {
    alert('Failed to delete chat');
  }
};

// Send message
app.post('/message', authMiddleware(true), async (req, res) => {
  try {
    const { recipient, message, listingTitle } = req.body;

    // Validate required fields
    if (!recipient || !message) {
      return res.status(400).json({ error: 'Recipient and message are required' });
    }

    // Create a new message object
    const newMessage = await messageModel.create({
      sender: req.user.username,
      receiver: recipient,
      content: message,
      listingTitle, // Include the listing title
      createdAt: new Date(),
    });

    res.status(201).json({
      message: 'Message sent successfully',
      data: newMessage,
    });
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: 'Failed to send message', details: err.message });
  }
});

app.post('/send-message', authMiddleware(true), async (req, res) => {
  try {
    console.log('Request body:', req.body); // Debugging log
    const { listingId, message, receiverId } = req.body;
    const senderId = req.user._id;

    // Check if a messenger already exists
    const existingMessenger = await messengerModel.findOne({
      $and: [
        { listingId },
        {
          $or: [
            { senderId, receiverId },
            { senderId: receiverId, receiverId: senderId },
          ],
        },
      ],
    });

    console.log('Existing Messenger:', existingMessenger); // Debugging log

    if (existingMessenger) {
      return res.status(400).json({ error: 'Messenger already exists. Use the reply endpoint.' });
    }

    // Create a new messenger
    const newMessenger = await messengerModel.create({
      senderId,
      receiverId,
      listingId,
      messages: [], // Initialize with an empty array
    });

    console.log('New Messenger Created:', newMessenger); // Debugging log

    // Create the first message
    const newMessage = await messageModel.create({
      senderId,
      receiverId,
      content: message,
      listingId,
    });

    console.log('New Message Created:', newMessage); // Debugging log

    // Add the new message to the messenger's messages array
    newMessenger.messages.push(newMessage._id);
    await newMessenger.save();
    console.log('Message added to messenger:', newMessenger); // Debugging log

    // Add the messenger to the listing
    const listing = await listingModel.findById(listingId);
    if (!listing) {
      console.log('Listing not found for listingId:', listingId); // Debugging log
      return res.status(404).json({ error: 'Listing not found' });
    }

    listing.messengers.push(newMessenger._id);
    await listing.save();
    console.log('Messenger added to listing:', listing); // Debugging log

    res.status(201).json({
      message: 'Message sent successfully',
      data: newMessage,
    });
  } catch (err) {
    console.error('Error in /send-message:', err); // Debugging log
    res.status(500).json({ error: 'Failed to send message', details: err.message });
  }
});

app.post('/reply-message', authMiddleware(true), async (req, res) => {
  try {
    const { messengerId, message } = req.body;
    const senderId = req.user._id;

    // Find the messenger
    const messenger = await messengerModel.findById(messengerId);
    if (!messenger) {
      return res.status(404).json({ error: 'Messenger not found' });
    }

    // Create a new message
    const newMessage = await messageModel.create({
      senderId,
      receiverId: messenger.receiverId === senderId ? messenger.senderId : messenger.receiverId,
      content: message,
      listingId: messenger.listingId,
    });

    // Add the new message to the messenger's messages array
    messenger.messages.push(newMessage._id);
    await messenger.save();

    res.status(201).json({
      message: 'Reply sent successfully',
      data: newMessage,
    });
  } catch (err) {
    console.error('Error replying to message:', err);
    res.status(500).json({ error: 'Failed to reply to message', details: err.message });
  }
});

app.get('/listing/:listingId/messengers', authMiddleware(true), async (req, res) => {
  try {
    const { listingId } = req.params;

    console.log('Fetching messengers for listingId:', listingId); // Debugging log

    // Find the listing and populate its messengers
    const listing = await listingModel
      .findById(listingId)
      .populate({
        path: 'messengers',
        populate: [
          { path: 'senderId', model: 'comp', select: 'Username' },
          { path: 'receiverId', model: 'comp', select: 'Username' },
          { path: 'messages', model: 'message', select: 'senderId content timestamp' },
        ],
      });

    if (!listing) {
      console.log('Listing not found for listingId:', listingId); // Debugging log
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json(listing.messengers);
  } catch (err) {
    console.error('Error fetching messengers:', err); 
    res.status(500).json({ error: 'Failed to fetch messengers', details: err.message });
  }
});

app.get('/my-messengers', authMiddleware(true), async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all messengers where the user is either the sender or the receiver
    const messengers = await messengerModel
      .find({
        $or: [{ senderId: userId }, { receiverId: userId }],
      })
      .populate([
        { path: 'senderId', model: 'comp', select: 'Username' },
        { path: 'receiverId', model: 'comp', select: 'Username' },
        { path: 'messages', model: 'message', select: 'content timestamp senderId' },
        { path: 'listingId', model: 'listing', select: 'title' }, // Populate listing title
      ]);

    res.json(messengers);
  } catch (err) {
    console.error('Error fetching messengers:', err);
    res.status(500).json({ error: 'Failed to fetch messengers', details: err.message });
  }
});
// Get messages between two users
app.get('/messages/:messengerId', authMiddleware(true), async (req, res) => {
  try {
    const { messengerId } = req.params;
    const messenger = await messengerModel.findById(messengerId).populate('messages');  // Populate the messages field
    if (!messenger) {
      return res.status(404).json({ error: 'Messenger not found' });
    }
    res.json(messenger);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages', details: err.message });
  }
});

// Get messages for the logged-in user
app.get('/my-messages', authMiddleware(true), async (req, res) => {
  try {
    const messages = await messageModel.find({ receiver: req.user.username }).sort({ timestamp: -1 });
    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages', details: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// Delete a messenger (entire conversation) by ID
app.delete('/delete-messenger/:messengerId', authMiddleware(true), async (req, res) => {
  try {
    const { messengerId } = req.params;
    const messenger = await messengerModel.findByIdAndDelete(messengerId);
    if (!messenger) {
      return res.status(404).json({ error: 'Messenger not found' });
    }
    await messageModel.deleteMany({ _id: { $in: messenger.messages } });

    res.json({ message: 'Conversation deleted successfully' });
  } catch (err) {
    console.error('Error deleting messenger:', err);
    res.status(500).json({ error: 'Failed to delete conversation', details: err.message });
  }
});
