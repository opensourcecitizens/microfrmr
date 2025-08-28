const express = require('express');
const authRoutes = require('./auth.js');
const farmRoutes = require('./farms.js');
const itemRoutes = require('./items.js');
const reminderRoutes = require('./reminders.js');
const analyticsRoutes = require('./analytics.js');
const marketplaceRoutes = require('./marketplace.js');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/farms', farmRoutes);
router.use('/items', itemRoutes);
router.use('/reminders', reminderRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/marketplace', marketplaceRoutes);

module.exports = router;