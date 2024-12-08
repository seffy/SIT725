const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const uri = "mongodb://localhost:27017";
const dbName = "ThoughtsDB";
const collectionName = "thoughtsdata";

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Handle form submission
app.post('/register', async (req, res) => {
    const { thoughts, tags } = req.body;
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db(dbName);
        const thoughtsCollection = db.collection(collectionName);

        const newThought = {
            thoughts,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            timestamp: new Date()
        };

        const result = await thoughtsCollection.insertOne(newThought);
        console.log("Data inserted:", result.insertedId);

        // Emit the new thought to connected clients
        io.emit('newThought', newThought);

        res.json({ message: "Form submitted successfully!", data: newThought });
    } catch (error) {
        console.error("Error saving data:", error.message);
        res.status(500).json({ error: "Error saving data. Please try again later." });
    } finally {
        await client.close();
    }
});

// Fetch all thoughts
app.get('/getAllThoughts', async (req, res) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db(dbName);
        const thoughtsCollection = db.collection(collectionName);

        const allThoughts = await thoughtsCollection.find().toArray();
        console.log("Fetched Thoughts:", allThoughts);

        res.json(allThoughts);
    } catch (error) {
        console.error("Error fetching thoughts:", error.message);
        res.status(500).json({ error: "Error fetching thoughts." });
    } finally {
        await client.close();
    }
});

// Add default test data (optional endpoint for testing)
app.post('/addTestThought', async (req, res) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try {
        await client.connect();
        const db = client.db(dbName);
        const thoughtsCollection = db.collection(collectionName);

        const testThought = {
            thoughts: "This is a test thought",
            tags: ["test", "debug"],
            timestamp: new Date()
        };

        await thoughtsCollection.insertOne(testThought);
        res.json({ message: "Test thought added successfully." });
    } catch (error) {
        console.error("Error adding test thought:", error.message);
        res.status(500).json({ error: "Error adding test thought." });
    } finally {
        await client.close();
    }
});

// Handle real-time connections with Socket.IO
io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Start the server
const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
