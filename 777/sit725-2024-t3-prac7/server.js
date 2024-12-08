let express = require('express');
let bodyParser = require('body-parser');
let app = express();
const { MongoClient } = require('mongodb');
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const uri = "mongodb://localhost:27017";
const dbName = "ThoughtsDB";
const collectionName = "thoughtsdata";

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Added to parse JSON payloads
app.use(express.static('public'));

// Serve the static HTML file
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

        const result = await thoughtsCollection.insertOne({
            thoughts,
            tags: tags || [],
            timestamp: new Date()
        });

        console.log("Data inserted:", result.insertedId);

        // Emit the new thought to connected clients
        io.emit('newThought', {
            thoughts,
            tags,
            timestamp: new Date()
        });

        res.send('Form submitted successfully!');
    } catch (err) {
        console.error("Error saving data:", err.message);
        res.status(500).send("Error saving data. Please try again later.");
    } finally {
        await client.close();
    }
});

// Endpoint to fetch all thoughts
app.get('/getAllThoughts', async (req, res) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db(dbName);
        const thoughtsCollection = db.collection(collectionName);
        const allThoughts = await thoughtsCollection.find().toArray();

        res.json(allThoughts);
    } catch (err) {
        console.error("Error fetching thoughts:", err.message);
        res.status(500).send("Error fetching thoughts.");
    } finally {
        await client.close();
    }
});

const PORT = 3001;
http.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
