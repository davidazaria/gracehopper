// this file only does the config for mongodb
const MongoClient = require('mongodb').MongoClient;

// process.env.MONGODB_URI is needed for when we deploy to Heroku
const connectionURL = process.env.MONGODB_URI || 'mongodb://localhost:27017/gracehopper';

function getDB() {
  return MongoClient.connect(connectionURL);
}

module.exports = { getDB };
