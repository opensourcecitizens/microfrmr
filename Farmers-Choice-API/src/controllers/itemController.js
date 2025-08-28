const Item = require('../models/item.js');

const createItem = async (req, res) => {
  try {
    const newItem = await Item.create(req.body);
    res.status(201).json({ message: 'Item created successfully', item: newItem });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create item', details: error.message });
  }
};

const getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items', details: error.message });
  }
};

const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch item', details: error.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item', details: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item', details: error.message });
  }
};

module.exports = {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
};