const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://admin:admin13@cluster0.y0r9q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});

client.connect();

module.exports = client;










