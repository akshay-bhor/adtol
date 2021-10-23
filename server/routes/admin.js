const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../AdTolAPIDoc.json');

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
const adminSiteData = require('../controllers/admin/site-data');
const adminCampaignsData = require('../controllers/admin/campaigns');

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
router.get('/site-data', isAuth, adminSiteData.getSiteData);
router.post('/site-data', isAuth, adminSiteData.addSiteData);
router.delete('/site-data', isAuth, adminSiteData.deleteSiteData);
router.get('/campaigns', isAuth, adminCampaignsData.getCampaignsData);
router.post('/campaigns', isAuth, adminCampaignsData.postCampaignsData);
router.post('/campaigns/set-status', isAuth, adminCampaignsData.setCampaignStatus);
router.get('/campaigns/banners', isAuth, adminCampaignsData.getCampaignBanners);
router.get('/campaigns/toggle-pro', isAuth, adminCampaignsData.getTogglePro);

if(process.env.NODE_ENV === 'development') {
    router.use('/__docs', swaggerUi.serve);
    router.get('/__docs', isAuth, (req, res, next) => {
        if(!req.userInfo || req.userInfo.rank != 1) {
            const err = new Error("Not allowed!");
            err.statusCode = 401;
            next(err);
        }
        next();
    }, swaggerUi.setup(swaggerDocument));
}

module.exports = router;