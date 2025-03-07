const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const compModel = require('./models/comp');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/comp', {
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

app.listen(3001, () => {
  console.log('server is running on port 3001');
});