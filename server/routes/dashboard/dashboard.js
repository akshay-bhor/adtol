const express = require('express');
const router = express.Router();
const isAuth = require('../../middleware/is-auth');
const summaryController = require('../../controllers/dashboard/summary');
const userStatusController = require('../../controllers/dashboard/user-status');
const advertiserController = require('../../controllers/dashboard/advertiser');
const campaignController = require('../../controllers/dashboard/campaigns');

const publisherController = require('../../controllers/dashboard/publisher');
const websitesController = require('../../controllers/dashboard/websites');

const reportController = require('../../controllers/dashboard/reports');
const referrelController = require('../../controllers/dashboard/referrels');

const billingController = require('../../controllers/dashboard/billing');
const paymentController = require('../../controllers/dashboard/payments');

router.get('/summary', isAuth, summaryController.summary);
router.get('/user-status', isAuth, userStatusController.userStatus);
router.get('/advertiser', isAuth, advertiserController.advertiser);
router.get('/campaigns', isAuth, campaignController.campaigns);
router.post('/campaigns/change-status/:campid', isAuth, campaignController.changeStatus);
router.post('/campaigns/change-budget/:campid', isAuth, campaignController.changeBudget);

router.post('/reports/:type', isAuth, reportController.reports);

router.get('/publisher', isAuth, publisherController.publisher);
router.get('/websites', isAuth, websitesController.websites);
router.post('/websites/add', isAuth, websitesController.addWebsite);
router.post('/websites/edit/:webid', isAuth, websitesController.editWebsite);
router.post('/websites/get-adcode', isAuth, websitesController.getAdcode);
router.get('/websites/formdata', websitesController.formdata);

router.get('/referrels', isAuth, referrelController.referrels);

router.get('/billing/payment-history', isAuth, billingController.payHistory);
router.get('/billing/withdraw-history', isAuth, billingController.withdrawHistory);
router.post('/billing/withdraw', isAuth, billingController.withdraw);
router.post('/billing/convert-pub-balance', isAuth, billingController.convertPubBal);
router.get('/billing/formdata', isAuth, billingController.formData);

router.post('/payment/create-order', isAuth, paymentController.createOrder);
router.post('/payment/verify-payment', isAuth, paymentController.verifyPayment);

module.exports = router;