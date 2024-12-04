const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/userDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB", err));

// Define Schema
const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
    gender: String,
    birthdate: Date,
});

// Define Model
const User = mongoose.model('User', userSchema);

// Serve HTML form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Handle form submission
app.post('/register', async (req, res) => {
    const { name, age, gender, birthdate } = req.body;

    const newUser = new User({
        name,
        age,
        gender,
        birthdate,
    });

    try {
        await newUser.save();
        res.send(`<h2>Registration Successful!</h2><p>${name}, your details have been saved.</p>`);
    } catch (err) {
        res.status(500).send("Error saving user. Please try again later.");
    }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
