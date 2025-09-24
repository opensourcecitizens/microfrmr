const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateUser } = require('../middleware/authentication');

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/profile', authenticateUser, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;