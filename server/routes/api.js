const express = require('express');
const router = express.Router();

const authRoutes = require('./auth/auth');
const dashRoutes = require('./dashboard/dashboard');
const acRoutes = require('./account/account');
const adRoutes = require('./ads/ads');

router.use('/auth', authRoutes);
router.use('/dashboard', dashRoutes);
router.use('/account', acRoutes);
router.use('/ads', adRoutes);

module.exports = router;