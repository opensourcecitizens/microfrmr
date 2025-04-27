import express from 'express';
import authRoutes from './auth';
import farmRoutes from './farms';
import itemRoutes from './items';
import reminderRoutes from './reminders';
import analyticsRoutes from './analytics';
import marketplaceRoutes from './marketplace';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/farms', farmRoutes);
router.use('/items', itemRoutes);
router.use('/reminders', reminderRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/marketplace', marketplaceRoutes);

export default router;