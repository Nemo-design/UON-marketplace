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
        if (comp.Password === Password) {
          const token = jwt.sign({ _id: comp._id }, 'your_jwt_secret', { expiresIn: '1h' });
          res.json({ token });
        } else {
          res.status(401).json('Login failed');
        }
      } else {
        res.json('User not found');
      }
    })
    .catch(err => res.status(500).json(err));
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

app.post('/upload', authMiddleware, async (req, res) => {
  const { title, description, price } = req.body;
  listingModel.create({ title, description, price })
    .then(listing => res.json(listing))
    .catch(err => res.status(500).json(err));
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