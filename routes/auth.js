const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth');
const oauthController = require('../controllers/o-auth');
const authorization = require('../middlewares/authorization');
const { getUser } = require('../middlewares/get-database');

const router = express.Router();

router.post(
  '/signup',
  [
    // Using express-validator to check if email, password and name are valid inputs
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 })
      .withMessage('Please enter a paassword with more than 5 characters.'),
    body('firstName').trim().not().isEmpty(),
    body('lastName').trim().not().isEmpty(),
  ],
  authController.postSignUpUser,
);

router.post('/login', getUser, authController.postLogin);
router.get('/logout', authController.getLogout);
router.get('/refresh-tokens', authorization, authController.getRefreshToken);
router.post('/reject-token', authController.postRejectToken);

// Google OAuth routes
// Directs to Google login page
router.get('/google', oauthController.getGoogleOAuth);
router.get('/google/callback', oauthController.getGoogleOAuthCallback);

router.get('/profile', authorization, getUser, authController.getOauthProfile);

module.exports = router;
