import { readDataFile, writeDataFile } from '../services/dataService.js';

const createMarketplaceItem = (req, res) => {
  try {
    const items = readDataFile('marketplace.json');
    const newItem = { id: Date.now(), ...req.body };
    items.push(newItem);
    writeDataFile('marketplace.json', items);
    res.status(201).json({ message: 'Marketplace item created successfully', item: newItem });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create marketplace item' });
  }
};

const getAllMarketplaceItems = (req, res) => {
  try {
    const items = readDataFile('marketplace.json');
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch marketplace items' });
  }
};

const getMarketplaceItemById = (req, res) => {
  try {
    const items = readDataFile('marketplace.json');
    const item = items.find((i) => i.id === parseInt(req.params.id, 10));
    if (!item) {
      return res.status(404).json({ error: 'Marketplace item not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch marketplace item' });
  }
};

export default {
  createMarketplaceItem,
  getAllMarketplaceItems,
  getMarketplaceItemById,
};