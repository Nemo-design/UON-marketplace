const express = require('express');
const router = express.Router();
const listingModel = require('./models/listing'); // Import the listing model
const authMiddleware = require('./middleware/authMiddleware'); // Import the auth middleware

// Fetch all listings for the Electronics category
router.get('/', authMiddleware, async (req, res) => {
  try {
    const listings = await listingModel.find({ category: 'Electronics' }); // Filter by category
    res.json(listings); // Return the filtered listings
  } catch (err) {
    console.error('Error fetching electronics listings:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// Upload a new listing for the Electronics category
router.post('/upload', authMiddleware, async (req, res) => {
  const { title, description, price, username, image } = req.body;

  // Validate required fields
  if (!title || !description || !price || !username || !image) {
    return res.status(400).json({ error: 'All fields (title, description, price, username, image) are required' });
  }

  try {
    const newListing = await listingModel.create({
      title,
      description,
      price,
      username,
      image,
      category: 'Electronics', // Automatically set the category to Electronics
    });

    res.json({ message: 'Listing uploaded successfully!', data: newListing });
  } catch (err) {
    console.error('Error uploading listing:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// Fetch a single listing by ID in the Electronics category
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const listing = await listingModel.findOne({ _id: req.params.id, category: 'Electronics' });
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json(listing);
  } catch (err) {
    console.error('Error fetching listing:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// Edit a listing in the Electronics category
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, description, price, image } = req.body;

  try {
    const updatedListing = await listingModel.findOneAndUpdate(
      { _id: req.params.id, category: 'Electronics' },
      { title, description, price, image },
      { new: true }
    );

    if (!updatedListing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json({ message: 'Listing updated successfully!', data: updatedListing });
  } catch (err) {
    console.error('Error updating listing:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// Delete a listing in the Electronics category
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedListing = await listingModel.findOneAndDelete({ _id: req.params.id, category: 'Electronics' });
    if (!deletedListing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json({ message: 'Listing deleted successfully!' });
  } catch (err) {
    console.error('Error deleting listing:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

module.exports = router;