const express = require("express");
const router = express.Router();
const farmController = require("../controllers/farmController");

// Example CRUD
router.get("/", farmController.getFarms);       // List farms
router.post("/", farmController.createFarm);    // Add new farm
router.get("/:id", farmController.getFarmById); // Get farm by ID
router.put("/:id", farmController.updateFarm);  // Update farm
router.delete("/:id", farmController.deleteFarm); // Delete farm

module.exports = router;
