const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { generateTokens } = require('../util/jwt-tokens');
const { getRefreshTokens } = require('../util/jwt-tokens');
const { throwErrorObject } = require('../helpers/generic');

const { signUp } = require('../models/user-sql');

// Middleware for signing up user
exports.postSignUpUser = (req, res, next) => {
  // Check for any validation errors and return JSON response with error message
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errMsg = errors.array();
    return res.status(400).json({ message: errMsg[0].msg });
  }

  const signUpUserHandler = async () => {
    const { firstName, lastName, email, password } = req.body;
    try {
      // Hashing password with async function
      const hashedPw = await bcrypt.hash(password, 12);
      // Create new user model and write to database
      // return objects specifically for MySQL
      const [newUser, created] = await signUp(
        false,
        firstName,
        lastName,
        email,
        hashedPw,
      );

      if (!created) throwErrorObject('User already exists in database.', 401);
      return res.status(200).json({
        message: `Successfully added ${email} to user database.`,
        createdUser: newUser,
      });
    } catch (err) {
      return res.status(400).json({ message: err.message, user: email });
    }
  };
  return signUpUserHandler();
};

// Middleware for logging in user
exports.postLogin = (req, res, next) => {
  // Checks password and generates token if password is valid
  const loginHandler = async () => {
    try {
      const passwordValid = await bcrypt.compare(
        req.body.password,
        req.user.password,
      );

      if (!passwordValid) {
        throwErrorObject('Password is invalid. Please check again.', 401);
      }

      // User credentials are valid; generating tokens and sending response
      const tokens = await generateTokens(req.user._id.toString(), 'LOGIN');

      res.cookie('accessToken', tokens.accessToken, { httpOnly: true });
      res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true });
      return res.status(200).json({
        message: 'Authentication is valid. Login success.',
        _id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      return res.status(err.statusCode).json({ message: err.message });
    }
  };

  loginHandler();
};

// Middleware for refreshing token
exports.getRefreshToken = (req, res, next) => {
  const _id = req._id;
  const refreshToken = req.cookies.refreshToken || '';

  const refreshTokenHandler = async () => {
    try {
      // Check if refresh token is valid
      const refreshTokenValid = jwt.verify(
        refreshToken,
        'SECRET_REFRESH_KEY',
      );

      // Retrieve user object stored in database corresponding to refresh token
      const refreshTokens = getRefreshTokens();
      const refTokenObj = refreshTokens.find(
        (obj) => obj.refreshToken === refreshToken,
      );

      if (!refTokenObj || refTokenObj._id !== _id) {
        throwErrorObject(
          'Refresh token or user is invalid. Unable to issue new access token.',
          404,
        );
      }

      // Generate access token if user and refresh token are valid
      const tokens = await generateTokens(_id, 'REFRESH');

      res.cookie('accessToken', tokens.accessToken, { httpOnly: true });
      return res.status(200).json({
        message: 'Access token successfully refreshed.',
        _id: _id,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      return res.status(err.statusCode).json({ message: err.message });
    }
  };
  refreshTokenHandler();
};

exports.postRejectToken = (req, res, next) => {
  const { rejectRefreshToken } = req.body;

  const refreshTokens = getRefreshTokens();
  const index = refreshTokens.findIndex(
    (obj) => obj.refreshToken === rejectRefreshToken,
  );

  const refTokenObj = refreshTokens[index];

  if (!refTokenObj) {
    return res.status(500).json({
      message: 'No refresh token found in database. Unable to reject token.',
    });
  }

  refreshTokens.splice(index, 1);
  return res
    .status(200)
    .json({ message: `Refresh token for UserID ${refTokenObj._id} deleted.` });
};

// To delete access and refresh tokens in cookies
exports.getLogout = (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;
  if (!accessToken) {
    return res.status(401).json({
      message: 'No access token found in cookies. Unable to log user out.',
    });
  }

  const refreshTokens = getRefreshTokens();
  const index = refreshTokens.findIndex(
    (obj) => obj.refreshToken === refreshToken,
  );

  let refreshTokenMsg;

  if (index > 0) {
    refreshTokens.splice(index, 1);
    refreshTokenMsg = 'Refresh token successfully deleted from database.';
  } else {
    refreshTokenMsg = 'Refresh token provided does not exist in database.';
  }

  return res
    .status(200)
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .json({
      message: 'User successfully logged out. Token cookies cleared.',
      refreshTokenMsg,
    });
};

exports.getOauthProfile = (req, res, next) => {
  res.status(200).json({
    message: "Successfully retrieved OAuth user profile.",
    _id: req.user.id,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
  });
};