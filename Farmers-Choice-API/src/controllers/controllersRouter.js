import { Router } from 'express';
import authController from '../controllers/authController';
import farmController from '../controllers/farmController';
import itemController from '../controllers/itemController';
import reminderController from '../controllers/reminderController';
import analyticsController from '../controllers/analyticsController';
import marketplaceController from '../controllers/marketplaceController';

const router = Router();

// Authentication routes
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);

// Farm routes
router.post('/farms', farmController.createFarm);
router.get('/farms', farmController.getAllFarms);
router.get('/farms/:id', farmController.getFarmById);
router.put('/farms/:id', farmController.updateFarm);
router.delete('/farms/:id', farmController.deleteFarm);

// Item routes
router.post('/items', itemController.addItem);
router.get('/items', itemController.getAllItems);
router.get('/items/:id', itemController.getItemById);
router.put('/items/:id', itemController.updateItem);
router.delete('/items/:id', itemController.deleteItem);

// Reminder routes
router.post('/reminders', reminderController.createReminder);
router.get('/reminders', reminderController.getAllReminders);
router.get('/reminders/:id', reminderController.getReminderById);
router.delete('/reminders/:id', reminderController.deleteReminder);

// Analytics routes
router.get('/analytics', analyticsController.getAnalyticsData);

// Marketplace routes
router.get('/marketplace', marketplaceController.listItems);
router.post('/marketplace/purchase', marketplaceController.purchaseItem);

export default router;