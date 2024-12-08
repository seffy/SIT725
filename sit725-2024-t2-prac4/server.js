let express = require('express');
let bodyParser = require('body-parser');
let app = express();
const { MongoClient } = require('mongodb');

// MongoDB URI
const uri = "mongodb://localhost:27017";

// Database and Collection names
const dbName = "userDB";
const collectionName = "users";

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

// Handle form submission
app.post('/register', async (req, res) => {
    const { thoughts, tags } = req.body;

    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try {
        // Connect to MongoDB
        await client.connect();
        console.log("Connected to MongoDB");

        // Insert user into the database
        const db = client.db(dbName);
        const users = db.collection(collectionName);

        const result = await users.insertOne({
            name,
            age: parseInt(age),
            phone,
            email,
        });

        // Redirect to a successful registration page
        res.sendFile(__dirname + '/views/success.html');
    } catch (err) {
        console.error("Error connecting to MongoDB or saving data:", err);
        res.status(500).send("Error saving user. Please try again later.");
    } finally {
        // Ensure client is closed
        await client.close();
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});