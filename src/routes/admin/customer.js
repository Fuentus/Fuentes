const express = require("express");
const router = express.Router();

const customerController = require('../../controllers/admin/CustomerController')

router.get('/', customerController.getAllCustomers);

router.get('/:id', customerController.getCustomersById)

router.put('/:id', customerController.updateCustomerById)

router.delete('/:id', customerController.deleteCustomersById)

module.exports = router
