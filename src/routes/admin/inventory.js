const express = require("express");
const router = express.Router();

const inventoryController = require("../../controllers/admin/InventoryController");


router.post('/', inventoryController.createInventory);

router.get('/', inventoryController.getInventory);

router.get('/:id', inventoryController.getOneInventory)

router.put('/:id', inventoryController.updateInventory)

router.delete('/:id', inventoryController.deleteInventory)

module.exports = router
