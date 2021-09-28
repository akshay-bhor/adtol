const express = require('express');
const router = express.Router();

const contactController =  require('../../controllers/contact');
const recaptchaValidation = require('../../middleware/recaptcha-validation');

router.post('/send-message', recaptchaValidation, contactController.sendMessage);

module.exports = router