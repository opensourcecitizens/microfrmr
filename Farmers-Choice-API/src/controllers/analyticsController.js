import { readDataFile } from '../services/dataService.js';

const getAnalytics = (req, res) => {
  try {
    const analytics = readDataFile('analytics.json');
    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

export default {
  getAnalytics,
}; 