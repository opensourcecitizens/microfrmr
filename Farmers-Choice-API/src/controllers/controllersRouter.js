const { Router } = require('express');
const authController = require('../controllers/authController.js');
const farmController = require('../controllers/farmController.js');
const itemController = require('../controllers/itemController.js');
const reminderController = require('../controllers/reminderController.js');
const analyticsController = require('../controllers/analyticsController.js');
const marketplaceController = require('../controllers/marketplaceController.js');

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
router.post('/items', itemController.createItem);
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
router.get('/analytics', analyticsController.getAnalytics);

// Marketplace routes
router.post('/marketplace', marketplaceController.createMarketplaceItem);
router.get('/marketplace', marketplaceController.getAllMarketplaceItems);
router.get('/marketplace/:id', marketplaceController.getMarketplaceItemById);
router.put('/marketplace/:id', marketplaceController.updateMarketplaceItem);
router.delete('/marketplace/:id', marketplaceController.deleteMarketplaceItem);

module.exports = router;