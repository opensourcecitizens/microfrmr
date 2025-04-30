import { readDataFile, writeDataFile } from '../services/dataService.js';

const createReminder = (req, res) => {
  try {
    const reminders = readDataFile('reminders.json');
    const newReminder = { id: Date.now(), ...req.body };
    reminders.push(newReminder);
    writeDataFile('reminders.json', reminders);
    res.status(201).json({ message: 'Reminder created successfully', reminder: newReminder });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create reminder' });
  }
};

const getAllReminders = (req, res) => {
  try {
    const reminders = readDataFile('reminders.json');
    res.status(200).json(reminders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reminders' });
  }
};

const getReminderById = (req, res) => {
  try {
    const reminders = readDataFile('reminders.json');
    const reminder = reminders.find((r) => r.id === parseInt(req.params.id, 10));
    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    res.status(200).json(reminder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reminder' });
  }
};

export default {
  createReminder,
  getAllReminders,
  getReminderById,
};