const express = require('express');
const router = express.Router();

const adValidation = require('../../middleware/ad-validation');
const adPreprocess = require('../../middleware/ad-preprocess');
const adServeControlller = require('../../controllers/ads/ad-serve');
const processClickController = require('../../controllers/ads/process');
const processPopController = require('../../controllers/ads/pops');
const testController = require('../../controllers/ads/test');

router.get('/serve/:ad_token', adValidation, adPreprocess, adServeControlller.adServe);
router.get('/pcs/click', processClickController.processClick);
router.get('/pop/:ad_token', adValidation, adPreprocess, processPopController.processPop);
router.get('/test', testController.test);

module.exports = router;
