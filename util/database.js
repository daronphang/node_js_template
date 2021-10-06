const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();
const sequelize = new Sequelize(
  'stock_app',
  process.env.MYSQLUSERNAME,
  process.env.MYSQLPASSWORD,
  {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  },
);

module.exports = sequelize;

// let _db;

// // Connecting to mongodb database
// // db object is reused as each .connect() creates a new connection pool (not singleton)
// const mongoConnect = (callback) => {
//   MongoClient.connect(
//     "mongodb+srv://daronphang:daronphang@shoppingappcluster.havbu.mongodb.net/shoppingAppDatabase?retryWrites=true&w=majority"
//   )
//     .then((client) => {
//       console.log("Connected to database.");
//       _db = client.db(); // can input database name as argument
//       callback();
//     })
//     .catch((err) => {
//       throw err; // cancel execution of starting app server if db is not connected
//     });
// };

// // retrieving database instance
// const getDb = () => {
//   if (_db) {
//     return _db;
//   }
//   throw Error('No existing database object found.');
// };
