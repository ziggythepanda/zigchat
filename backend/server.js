const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');

// Connect to MongoDB (update with your connection string)
mongoose.connect('mongodb://localhost:27017/accountCreation', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a User model
const UserSchema = new mongoose.Schema({
    walletAddress: String,
    uniqueIdentifier: String,
    verified: { type: Boolean, default: false }
});

const User = mongoose.model('User', UserSchema);

const app = express();
app.use(bodyParser.json());

// Endpoint to create an account
app.post('/api/create-account', async (req, res) => {
    const { walletAddress } = req.body;
    const uniqueIdentifier = uuidv4();

    const newUser = new User({ walletAddress, uniqueIdentifier });
    await newUser.save();

    // Send back the unique identifier to the frontend
    res.json({ message: `Account created! Please send a transaction to inj1xlzmszxt4examxqqynmyjuwgvqrc0ahcy3l8dg with the memo: ${uniqueIdentifier}` });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});