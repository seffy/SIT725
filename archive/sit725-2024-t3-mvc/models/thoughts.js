let client = require('../dbConnection');

let collection = client.db().collection('thoughts');

function postThoughts(thoughts, callback) {
    collection.insertOne(thoughtsdata,callback);
}

function getAllThoughts(callback) {
    collection.find({}).toArray(callback);
}

module.exports = {postThoughts,getAllThoughts}