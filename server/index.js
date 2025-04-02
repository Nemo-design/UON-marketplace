const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // for authentication
const path = require('path');
const compModel = require('./models/comp');
const listingModel = require('./models/listing');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://Comp3851:comp3851b@cluster0.csaho.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post('/login', async (req, res) => {
  const { Email, Password } = req.body;
  compModel.findOne({ Email })
    .then(comp => {
      if (comp) {
        if (comp.Password === Password) { // Replace this with bcrypt comparison if passwords are hashed
          const token = jwt.sign({ _id: comp._id, username: comp.Username }, 'your_jwt_secret', { expiresIn: '1h' }); // Include Username
          res.json({ token, username: comp.Username }); // Send Username in the response
        } else {
          res.status(401).json({ error: 'Invalid email or password' });
        }
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    })
    .catch(err => res.status(500).json({ error: 'Internal Server Error', details: err }));
});

app.post('/register', async (req, res) => {
  compModel.create(req.body)
    .then(comp => res.json(comp))
    .catch(err => res.status(500).json(err));
});

app.get('/listings', authMiddleware, async (req, res) => {
  try {
    const listings = await listingModel.find();
    res.json(listings);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get only the logged-in user's listings
app.get('/my-listings', authMiddleware, async (req, res) => {
  try {
    const username = req.user.username; // Extract username from the token
    if (!username) {
      return res.status(400).json({ error: 'Username not found in token' });
    }

    const listings = await listingModel.find({ username }); // Filter listings by username
    res.json(listings);
  } catch (err) {
    console.error('Error in /my-listings:', err); // Log the error
    res.status(500).json({ error: 'Internal Server Error', details: err });
  }
});

app.post('/upload', authMiddleware, async (req, res) => {
  const { title, description, price } = req.body;
  const username = req.user.username; // Extract Username from the token

  if (!username) {
    return res.status(400).json({ error: 'Username not found in token' });
  }

  listingModel.create({ title, description, price, username })
    .then(listing => res.json(listing))
    .catch(err => res.status(500).json({ error: 'Internal Server Error', details: err }));
});

app.delete('/listings/:id', authMiddleware, async (req, res) => {
  try {
    const listing = await listingModel.findByIdAndDelete(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json({ message: 'Listing deleted successfully' });
  } catch (err) {
    res.status(500).json(err);
  }
});

app.listen(3001, () => {
  console.log('server is running on port 3001');
});