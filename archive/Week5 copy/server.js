const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const http = require('http');
const Message = require('./models/Message'); // Import the Message schema

// App setup
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(express.static('public'));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/messages', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.get('/messages', async (req, res) => {
  const messages = await Message.find();
  res.json(messages);
});

app.post('/messages', async (req, res) => {
  const { text } = req.body;
  const newMessage = new Message({ text });
  await newMessage.save();
  io.emit('message-added', newMessage); // Notify clients
  res.json(newMessage);
});

app.put('/messages/:id', async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const updatedMessage = await Message.findByIdAndUpdate(id, { text }, { new: true });
  io.emit('message-updated', updatedMessage); // Notify clients
  res.json(updatedMessage);
});

app.delete('/messages/:id', async (req, res) => {
  const { id } = req.params;
  const deletedMessage = await Message.findByIdAndDelete(id);
  io.emit('message-deleted', deletedMessage); // Notify clients
  res.json(deletedMessage);
});

// WebSocket setup
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});