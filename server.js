const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');

// Connect to MongoDB
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

    // Here you would typically send instructions to the user for making the transaction
    res.json({ message: `Account created! Please send a transaction to inj1xlzmszxt4examxqqynmyjuwgvqrc0ahcy3l8dg with the memo: ${uniqueIdentifier}` });
});

// Placeholder for transaction confirmation logic
app.post('/api/confirm-transaction', async (req, res) => {
    const { walletAddress, uniqueIdentifier } = req.body;

    // Here you would implement logic to check the blockchain for the transaction

    // Simulate transaction confirmation for demonstration
    const user = await User.findOne({ walletAddress, uniqueIdentifier });
    if (user) {
        user.verified = true;
        await user.save();
        res.json({ message: 'Transaction confirmed! You can now set your password.' });
    } else {
        res.status(400).json({ message: 'Transaction not found or already verified.' });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});