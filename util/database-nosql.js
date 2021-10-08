const mongodb = require('mongodb');
const dotenv = require('dotenv');

const { MongoClient } = mongodb;

dotenv.config();

// Setup the initial database connection which will keep on running
// Functions interacting with database will refer to this database reference
let _db;

// Connecting to mongodb database
// db object is reused as each .connect() creates a new connection pool (not singleton)
const mongoConnect = (callback) => {
  MongoClient.connect(process.env.MONGODBSERVER)
    .then((client) => {
      console.log('Connected to MongoDB.');
      _db = client.db(); // can input database name as argument
      callback();
    })
    .catch((err) => {
      throw err; // cancel execution of starting app server if db is not connected
    });
};

// retrieving database instance
const getDb = () => {
  if (_db) {
    return _db;
  }
  throw Error('No existing database object found.');
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
