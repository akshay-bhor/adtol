const express = require('express');
const router = express.Router();

const authController =  require('../../controllers/auth');
const isAuth = require('../../middleware/is-auth');
const recaptchaValidation = require('../../middleware/recaptcha-validation');
const googleAuth = require('../../middleware/google-auth');

router.post('/register', recaptchaValidation, googleAuth, isAuth, authController.register);
router.post('/login', isAuth, authController.login);
router.post('/glogin', googleAuth, isAuth, authController.glogin);
router.post('/change-pass', isAuth, authController.changePass);
router.post('/forgot-pass', isAuth, authController.forgetPass);
router.post('/reset-pass', isAuth, authController.resetPass);
router.get('/get-countries', authController.formData);

module.exports = router