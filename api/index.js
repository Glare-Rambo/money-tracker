const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const Transaction = require('./models/Transaction.js');
const { default: mongoose } = require('mongoose');
app.use(cors());
app.use(express.json());
app.get('/api/test', (req, res) => {
    res.json("test ok2");
});

app.post('/api/transaction', async(req, res) => {
    await mongoose.connect(process.env.MONGO_CONNECTION_URL);
    console.log("Connected to database",process.env.MONGO_CONNECTION_URL);
    const {name, description, datetime, price} = req.body; 
    const transaction = await Transaction.create({name, description, datetime, price});
    res.json(transaction);
});

app.get('/api/transactions', async(req, res) => {
    await mongoose.connect(process.env.MONGO_CONNECTION_URL);
    const transactions = await Transaction.find();
    res.json(transactions);
});

app.listen(4000);