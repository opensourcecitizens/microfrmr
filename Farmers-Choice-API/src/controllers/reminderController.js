const Reminder = require('../models/reminder.js');

const createReminder = async (req, res) => {
  try {
    const newReminder = await Reminder.create(req.body);
    res.status(201).json({ message: 'Reminder created successfully', reminder: newReminder });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create reminder', details: error.message });
  }
};

const getAllReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find();
    res.status(200).json(reminders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reminders', details: error.message });
  }
};

const getReminderById = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);
    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    res.status(200).json(reminder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reminder', details: error.message });
  }
};

const deleteReminder = async (req, res) => {
  try {
    await Reminder.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete reminder', details: error.message });
  }
};

module.exports = {
  createReminder,
  getAllReminders,
  getReminderById,
  deleteReminder,
};