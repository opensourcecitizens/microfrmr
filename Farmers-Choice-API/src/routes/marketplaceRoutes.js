const express = require("express");
const router = express.Router();
const marketplaceController = require("../controllers/marketplaceController");

router.get("/", marketplaceController.getMarketplaceItems);
router.post("/", marketplaceController.createMarketplaceItem);

module.exports = router;
// Marketplace routes currently only support listing and adding items.