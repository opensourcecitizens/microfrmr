const MarketplaceItem = require('../models/marketPlaceItem.js');

const createMarketplaceItem = async (req, res) => {
  try {
    const newItem = await MarketplaceItem.create(req.body);
    res.status(201).json({ message: 'Marketplace item created successfully', item: newItem });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create marketplace item', details: error.message });
  }
};

const getAllMarketplaceItems = async (req, res) => {
  try {
    const items = await MarketplaceItem.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch marketplace items', details: error.message });
  }
};

const getMarketplaceItemById = async (req, res) => {
  try {
    const item = await MarketplaceItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Marketplace item not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch marketplace item', details: error.message });
  }
};

const updateMarketplaceItem = async (req, res) => {
  try {
    const item = await MarketplaceItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) {
      return res.status(404).json({ error: 'Marketplace item not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update marketplace item', details: error.message });
  }
};

const deleteMarketplaceItem = async (req, res) => {
  try {
    await MarketplaceItem.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete marketplace item', details: error.message });
  }
};

module.exports = {
  createMarketplaceItem,
  getAllMarketplaceItems,
  getMarketplaceItemById,
  updateMarketplaceItem,
  deleteMarketplaceItem,
};