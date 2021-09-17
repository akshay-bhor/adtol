const express = require('express');
const router = express.Router();

const adminHomeControlller = require('../controllers/admin/home');
const isAuth = require('../middleware/is-auth');
const adminLoginController = require('../controllers/admin/login');
const adminUsersController = require('../controllers/admin/users');
const adminNotifyController = require('../controllers/admin/notify');
const adminSitesController = require('../controllers/admin/sites');
const adminPaymentsController = require('../controllers/admin/payments');
const adminWithdrawsController = require('../controllers/admin/withdraws');
const adminSecKeysController = require('../controllers/admin/sec-keys');
const adminRatesLimits = require('../controllers/admin/rates-limits');

router.get('', isAuth, adminHomeControlller.home);
router.get('/login', isAuth, adminLoginController.getAdminLogin);
router.post('/login', isAuth, adminLoginController.postAdminLogin);
router.get('/users', isAuth, adminUsersController.getAdminUsersList);
router.post('/users', isAuth, adminUsersController.postAdminUsersList);
router.get('/users/ban/:uid', isAuth, adminUsersController.postAdminUserStatusChange);
router.post('/users/adjust-balance/:type/:uid', isAuth, adminUsersController.postAdminAdjustUserBalance);
router.get('/notify', isAuth, adminNotifyController.getAdminUserNotify);
router.post('/notify', isAuth, adminNotifyController.postAdminUserNotify);
router.get('/sites', isAuth, adminSitesController.getSiteList);
router.post('/sites', isAuth, adminSitesController.postSiteList);
router.post('/sites/set-status', isAuth, adminSitesController.postChangeSiteStatus);
router.get('/payments', isAuth, adminPaymentsController.getPaymentsList);
router.post('/payments', isAuth, adminPaymentsController.postPaymentsList);
router.get('/withdraws', isAuth, adminWithdrawsController.getWithdrawList);
router.post('/withdraws', isAuth, adminWithdrawsController.postWithdrawsList);
router.post('/withdraws/change-status', isAuth, adminWithdrawsController.postChangeWithdrawStatus);
router.get('/keys', isAuth, adminSecKeysController.secKeys);
router.get('/get-keys', isAuth, adminSecKeysController.genKeys);
router.get('/rates', isAuth, adminRatesLimits.getRatesLimits);
router.post('/rates', isAuth, adminRatesLimits.postRatesLimits);

module.exports = router;