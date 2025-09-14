const express = require("express");
const router = express.Router();
const { createmarketplace, getmarketplaces, getmarketplaceById, updatemarketplace, deletemarketplace } = require("../controllers/marketplaceController");

router.get("/", getMarketplacesItems);
router.post("/", createMarketplaceItem);

module.exports = router;
// Marketplace routes currently only support listing and adding items.