// models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }, // Automatically set the timestamp
});

module.exports = mongoose.model('Message', messageSchema);