const express = require('express');
const router = express.Router();
const { subscribeToNewsletter, sendNewsletter } = require('../controllers/newsletterController.js');
const { protect, admin } = require('../middleware/authMiddleware');

// Anyone can subscribe, so no `protect` or `admin` middleware is needed.
router.route('/subscribe').post(subscribeToNewsletter);
router.route('/send').post(protect, admin, sendNewsletter);

module.exports = router;