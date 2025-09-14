const express = require("express");
const router = express.Router();
const { createanalytics, getanalyticss, getanalyticsById, updateanalytics, deleteanalytics } = require("../controllers/analyticsController");

router.get("/", analyticsController.getAllAnalytics);

module.exports = router;
// Analytics routes are typically read-only, so no POST, PUT, DELETE methods are included.