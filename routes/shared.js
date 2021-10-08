const express = require('express');
const sharedController = require('../controllers/shared');

const router = express.Router();

router.get('/test', sharedController.getTest);

module.exports = router;
