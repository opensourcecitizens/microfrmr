const Farm = require('../models/farm.js');

const createFarm = async (req, res) => {
  try {
    const newFarm = await Farm.create(req.body);
    res.status(201).json({ message: 'Farm created successfully', farm: newFarm });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create farm', details: error.message });
  }
};

const getAllFarms = async (req, res) => {
  try {
    const farms = await Farm.find();
    res.status(200).json(farms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch farms', details: error.message });
  }
};

const getFarmById = async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id);
    if (!farm) {
      return res.status(404).json({ error: 'Farm not found' });
    }
    res.status(200).json(farm);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch farm', details: error.message });
  }
};

const updateFarm = async (req, res) => {
  try {
    const farm = await Farm.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!farm) {
      return res.status(404).json({ error: 'Farm not found' });
    }
    res.status(200).json(farm);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update farm', details: error.message });
  }
};

const deleteFarm = async (req, res) => {
  try {
    await Farm.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete farm', details: error.message });
  }
};

module.exports = {
  createFarm,
  getAllFarms,
  getFarmById,
  updateFarm,
  deleteFarm,
};