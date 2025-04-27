import { readDataFile } from '../services/dataService.js';

const createFarm = (req, res) => {
  // Logic for creating a farm (not using appData here)
  res.status(201).json({ message: 'Farm created successfully' });
};

const getAllFarms = (req, res) => {
  try {
    const farms = readDataFile('farms.json'); // Ensure 'farms.json' exists in appData
    res.status(200).json(farms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch farms' });
  }
};

const getFarmById = (req, res) => {
  try {
    const farms = readDataFile('farms.json');
    const farm = farms.find((f) => f.id === parseInt(req.params.id, 10));
    if (!farm) {
      return res.status(404).json({ error: 'Farm not found' });
    }
    res.status(200).json(farm);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch farm' });
  }
};

// Other farm-related methods...

export default {
  createFarm,
  getAllFarms,
  getFarmById,
  // Add other methods here
};