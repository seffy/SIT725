const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const mongooseUri = process.env.NODE_ENV === 'test' ? 'mongodb+srv://admin:admin13@cluster0.y0r9q.mongodb.net/mymind-test?retryWrites=true&w=majority' : 'mongodb+srv://admin:admin13@cluster0.y0r9q.mongodb.net/mymind?retryWrites=true&w=majority';

mongoose.connect(mongooseUri);

const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', messageSchema);

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'An error occurred while fetching messages.' });
  }
});

app.post('/messages', async (req, res) => {
  try {
    const { text } = req.body;
    const newMessage = new Message({ text });
    await newMessage.save();
    io.emit('message-added', newMessage);
    res.json(newMessage);
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({ error: 'An error occurred while adding the message.' });
  }
});

app.put('/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    // Update only the `text` field
    await Message.findByIdAndUpdate(id, { text }, { new: true });

    // Fetch all messages and sort by `createdAt`
    const messages = await Message.find().sort({ createdAt: -1 });

    // Notify clients with the updated sorted list
    io.emit('messages-updated', messages);

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ error: 'An error occurred while updating the message.' });
  }
});





app.delete('/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMessage = await Message.findByIdAndDelete(id);
    io.emit('message-deleted', deletedMessage);
    res.json(deletedMessage);
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'An error occurred while deleting the message.' });
  }
});




module.exports = { app, server };

const PORT = process.env.NODE_ENV === 'test' ? 3002 : 8080;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});