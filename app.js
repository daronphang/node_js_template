const express = require('express');
const cookieParser = require('cookie-parser');

const User = require('./models/user');
const sequelize = require('./util/database');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const allowedOrigins = [
  'http://127.0.0.1:5050',
  'http://localhost:5050',
  'http://127.0.0.1:5000',
  'http://localhost:5000',
];

const app = express();

app.use(express.json()); // application/json
app.use(cookieParser()); // parse request cookies

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

// app.use('/auth', authRoutes);
// app.use('/user', userRoutes);

// uncaught errors in promise or try/catch as failsafe (SHOULD NOT END UP HERE)
app.use((error, req, res, next) => {
  console.log(error);
  // const errMsg = error.message;
  // return res.status(status).json({ message: errMsg });
});

// Sync models to database
sequelize
  .sync()
  .then((res) => {
    console.log('Connected to MySQL');
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
