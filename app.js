const express = require('express');
const cookieParser = require('cookie-parser');

// REMOVE WHERE APPROPRIATE
const passport = require('passport');
const sequelize = require('./util/database-sql');
const { mongoConnect } = require('./util/database-nosql');

const authRoutes = require('./routes/auth');
const sharedRoutes = require('./routes/shared');

const allowedOrigins = [
  'http://127.0.0.1:8000',
  'http://localhost:8000',
  'http://127.0.0.1:8080',
  'http://localhost:8080',
];

const app = express();

app.use(express.json()); // application/json
app.use(cookieParser()); // parse request cookies
app.use(passport.initialize());

// setting up CORS response to avoid errors
app.use((req, res, next) => {
  const { origin } = req.headers;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT,PATCH, DELETE',
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

app.use('/auth', authRoutes);
app.use('/shared', sharedRoutes);

// uncaught errors in promise or try/catch as failsafe (SHOULD NOT END UP HERE)
app.use((error, req, res, next) => {
  console.log(error);
  return res.status(500).json({ message: error.message });
});

// Sync models to database
sequelize
  .sync()
  .then((res) => {
    app.listen(8080);
    console.log('Connected to MySQL');
  })
  .catch((err) => {
    console.log(err);
  });

// For MongoDB
// mongoConnect(() => {
//   app.listen(8080);
// });
