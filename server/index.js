const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const compModel = require('./models/comp');
const listingModel = require('./models/listing');

const app = express();
app.use(express.json());
app.use(cors());

/*
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {////////
        */

mongoose.connect('mongodb+srv://Comp3851:comp3851b@cluster0.csaho.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
});


app.post('/login', async (req, res) => {
    const { Email, Password } = req.body;
    compModel.findOne
    ({ Email })
    .then(comp => {
        if (comp){
            if (comp.Password === Password) {
                res.json("Success");
            } else {
                res.status(401).json('Login failed');
            }
        }
        else {
            res.json('User not found');
        }
    })
});


app.post('/register', async (req, res) => {
  compModel.create(req.body)
    .then(comp => res.json(comp))
    .catch(err => res.status(500).json(err));
});

app.post('/upload', async (req, res) => {
    listingModel.create(req.body)
      .then(listing => res.json(listing))
      .catch(err => res.status(500).json(err));
    });

app.listen(3001, () => {
  console.log('server is running on port 3001');
});