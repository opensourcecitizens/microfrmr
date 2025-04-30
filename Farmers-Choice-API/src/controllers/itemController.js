import { readDataFile, writeDataFile } from '../services/dataService.js';

const createItem = (req, res) => {
  try {
    const items = readDataFile('items.json');
    const newItem = { id: Date.now(), ...req.body };
    items.push(newItem);
    writeDataFile('items.json', items);
    res.status(201).json({ message: 'Item created successfully', item: newItem });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create item' });
  }
};

const getAllItems = (req, res) => {
  try {
    const items = readDataFile('items.json');
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
};

const getItemById = (req, res) => {
  try {
    const items = readDataFile('items.json');
    const item = items.find((i) => i.id === parseInt(req.params.id, 10));
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch item' });
  }
};

export default {
  createItem,
  getAllItems,
  getItemById,
};