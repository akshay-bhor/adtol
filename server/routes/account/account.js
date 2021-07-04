const express = require('express');
const router = express.Router();
const isAuth = require('../../middleware/is-auth');
const accountController = require('../../controllers/account');

router.get('', isAuth, accountController.accountInfo);
router.post('/edit-details', isAuth, accountController.editAccountDetails);
router.post('/edit-payment', isAuth, accountController.editPayment);

module.exports = router;