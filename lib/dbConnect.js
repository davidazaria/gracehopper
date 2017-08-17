// this file only does the config for mongodb
const MongoClient = require('mongodb');

// process.env.MONGODB_URI is needed for when we deploy to Heroku
const connectionURL = process.env.MONGODB_URI || 'mongodb://localhost/gracehopper';

function getDB() {
  return MongoClient.connect(connectionURL);
}

module.exports = { getDB };
