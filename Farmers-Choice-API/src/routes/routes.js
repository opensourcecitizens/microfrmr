const express = require('express');
const authRoutes = require('./authRoutes.js');
const farmRoutes = require('./farmRoutes.js');
const itemRoutes = require('./itemsRoutes.js');
const reminderRoutes = require('./remindersRoutes.js');
const analyticsRoutes = require('./analyticsRoutes.js');
const marketplaceRoutes = require('./marketplaceRoutes.js');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/farms', farmRoutes);
router.use('/items', itemRoutes);
router.use('/reminders', reminderRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/marketplace', marketplaceRoutes);

module.exports = router;