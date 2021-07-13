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
// const workerRoute = require('./routes/worker')

const quoteRoutes = require('./quote');
router.use('quotes', quoteRoutes);

module.exports = router;