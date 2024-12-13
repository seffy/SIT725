const mongoose = require('mongoose');

const uri = "mongodb://localhost:27017";
const dbName = "NewThoughtsDB"; // New database name

const dbURL = `${uri}/${dbName}`;

mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log(`Connected to database: ${dbName}`))
    .catch((err) => console.error('Database connection failed:', err));

module.exports = mongoose;
