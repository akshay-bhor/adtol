const express = require('express');
const router = express.Router();

const authRoutes = require('./auth/auth');
const dashRoutes = require('./dashboard/dashboard');
const acRoutes = require('./account/account');
const adRoutes = require('./ads/ads');
const contactRoutes = require('./contact/contact');

router.use('/auth', authRoutes);
router.use('/dashboard', dashRoutes);
router.use('/account', acRoutes);
router.use('/display', adRoutes);
router.use('/contact', contactRoutes);

module.exports = router;