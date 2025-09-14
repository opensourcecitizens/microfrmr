const express = require("express");
const router = express.Router();
const { createitem, getitems, getitemById, updateitem, deleteitem } = require("../controllers/itemController");

router.get("/", itemController.getAllItems);
router.post("/", itemController.createItem);
router.get("/:id", itemController.getItemById);
router.put("/:id", itemController.updateItem);
router.delete("/:id", itemController.deleteItem);

module.exports = router;
