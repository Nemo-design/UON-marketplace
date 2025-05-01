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
    
    res.json({ token, username: user.Username });
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

// Send message
app.post('/message', authMiddleware(true), async (req, res) => {
  try {
    const { recipient, message } = req.body;
    
    if (!recipient || !message) {
      return res.status(400).json({ error: 'Recipient and message are required' });
    }

    const newMessage = await messageModel.create({
      sender: req.user.username,
      receiver: recipient,
      content: message,
      createdAt: new Date()
    });

    res.status(201).json({ 
      message: 'Message sent successfully',
      data: newMessage 
    });
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: 'Failed to send message', details: err.message });
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