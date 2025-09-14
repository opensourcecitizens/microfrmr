const express = require("express");
const router = express.Router();
const { createFarm, getFarms, getFarmById, updateFarm, deleteFarm } = require("../controllers/farmController");

// Example CRUD
router.get("/", getFarms);       // List farms
router.post("/", createFarm);    // Add new farm
router.get("/:id", getFarmById); // Get farm by ID
router.put("/:id", updateFarm);  // Update farm
router.delete("/:id", deleteFarm); // Delete farm

module.exports = router;
