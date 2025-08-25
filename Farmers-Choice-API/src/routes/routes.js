import express from 'express';
import authRoutes from './auth.js';
import farmRoutes from './farms.js';
import itemRoutes from './items.js';
import reminderRoutes from './reminders.js';
import analyticsRoutes from './analytics.js';
import marketplaceRoutes from './marketplace.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/farms', farmRoutes);
router.use('/items', itemRoutes);
router.use('/reminders', reminderRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/marketplace', marketplaceRoutes);

export default router;