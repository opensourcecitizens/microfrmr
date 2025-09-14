const express = require("express");
const router = express.Router();
const { createreminder, getreminders, getreminderById, updatereminder, deletereminder } = require("../controllers/reminderController");

router.get("/", reminderController.getAllReminders);
router.post("/", reminderController.createReminder);
router.get("/:id", reminderController.getReminderById);
router.put("/:id", reminderController.updateReminder);
router.delete("/:id", reminderController.deleteReminder);

module.exports = router;
