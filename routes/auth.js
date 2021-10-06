const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth');
const authorization = require('../middlewares/authorization');

const router = express.Router();

router.post(
  '/signup',
  [
    // Using express-validator to check if email, password and name are valid inputs
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value) => {
        // Check for existing user in user and OAuth user databases
        // Write some code...
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 })
      .withMessage('Please enter a paassword with more than 5 characters.'),
    body('name').trim().not().isEmpty(),
  ],
  authController.postSignUpUser,
);

router.post('/login', authController.postLogin);
router.get('/logout', authController.getLogout);
router.get('/refresh-tokens', authorization, authController.getRefreshToken);
router.post('/reject-token', authController.postRejectToken);

module.exports = router;
