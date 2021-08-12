const express = require("express");
const router = express.Router();

const inventoryController = require("../../controllers/admin/InventoryController");

const {
    validateReq,
    inventoryCreateValidator,
  } = require("../../validators/inventory-validator");

router.post('/', [inventoryCreateValidator], inventoryController.createInventory);

router.get('/', inventoryController.findAllInventory);

router.get('/:id', [validateReq], inventoryController.findInventoryById)

router.put('/:id', inventoryController.updateInventory)

router.delete('/:id', inventoryController.deleteInventory)

module.exports = router
