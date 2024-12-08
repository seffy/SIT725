const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const router = require('./routers/router');
require('./db/dbConnection');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 4040;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve frontend files
app.use('/api', router); // API routes

// WebSocket communication
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('new-thought', (thought) => {
        console.log(`New thought: ${thought}`);
        io.emit('update-thoughts', thought); // Broadcast to all connected clients
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
