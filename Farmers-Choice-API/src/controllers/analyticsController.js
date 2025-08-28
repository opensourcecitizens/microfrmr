const Analytics = require('../models/analytics.js');

const getAnalytics = async (req, res) => {
  try {
    const analytics = await Analytics.find();
    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics', details: error.message });
  }
};

module.exports = {
  getAnalytics,
};