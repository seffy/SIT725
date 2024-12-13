const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Replace the URI with your MongoDB Atlas connection string
const uri = "mongodb+srv://admin:admin13@cluster0.y0r9q.mongodb.net/?retryWrites=true&w=majority";
const dbName = "mymind"; // Updated database name
const collectionName = "mythoughts"; // Updated collection name

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.json());

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


// DELETE route for deleting a thought by ID
app.delete('/deleteThought/:id', async (req, res) => {
    const thoughtId = req.params.id; // Extract the ID from the URL
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db(dbName);
        const thoughtsCollection = db.collection(collectionName);

        const result = await thoughtsCollection.deleteOne({ _id: new ObjectId(thoughtId) });
        if (result.deletedCount === 1) {
            res.status(200).json({ message: "Thought deleted successfully" });
        } else {
            res.status(404).json({ error: "Thought not found" });
        }
    } catch (error) {
        console.error("Error deleting thought:", error.message);
        res.status(500).json({ error: "Failed to delete thought" });
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
const PORT = 3006;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});