const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

// app.use('/inventory', inventoryRoute)
// app.use('/operations', operationRoute)
// app.use('/projects', projectRoute)
// app.use('/workers', workerRoute)

// const inventoryRoute = require('./routes/inventory')
// const operationRoute = require('./routes/operations')
// const projectRoute = require('./routes/project')

const quoteRoutes = require('./quote');
const inventoryRoute = require('./inventory');
const operationRoute = require('./operations');
const workerRoute = require('./worker')
const customerRoute = require('./customer')
const projectRoutes = require('./project');
const InspectionRoutes = require("./inspection");
const MasterDController = require("../../controllers/admin/MasterDataController");


router.use('/quotes', quoteRoutes);
router.use('/inventory', inventoryRoute)
router.use('/operation', operationRoute)
router.use('/workers', workerRoute)
router.use('/customer', customerRoute)
router.use('/project', projectRoutes);
router.use('/inspection', InspectionRoutes);
router.use('/masterData', MasterDController.fetchAllMasterData);

module.exports = router;