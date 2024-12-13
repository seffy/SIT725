const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define a schema and model for the collection
const thoughtSchema = new mongoose.Schema({
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const Thought = mongoose.model('thoughtsdata', thoughtSchema);

// API to fetch all thoughts
router.get('/thoughts', async (req, res) => {
    try {
        const thoughts = await Thought.find({});
        res.json(thoughts);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch thoughts' });
    }
});

// API to add a new thought
router.post('/thoughts', async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Thought text is required' });
    }

    try {
        const newThought = new Thought({ text });
        await newThought.save();
        res.status(201).json({ message: 'Thought added successfully', thought: newThought });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add thought' });
    }
});

module.exports = router;
