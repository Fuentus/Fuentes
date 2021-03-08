const db = require('../models/');
const printLog = require('../util/fuentis_util');
const Inventory = db.Inventory;

exports.createInventory = (req, res, next) => {
    printLog(`Inventory : Inside createInventory`);


    printLog(`Inventory : Exit createInventory`);
}

exports.getInventory = (req, res, next) => {
    printLog(`Inventory : Inside getInventory`);


    printLog(`Inventory : Exit getInventory`);
}

exports.getOneInventory = (req, res, next) => {
    printLog(`Inventory : Inside getOneInventory`);


    printLog(`Inventory : Exit getOneInventory`);
}

exports.deleteInventory = (req, res, next) => {
    printLog(`Inventory : Inside deleteInventory`);


    printLog(`Inventory : Exit deleteInventory`);
}

exports.updateInventory = (req, res, next) => {
    printLog(`Inventory : Inside updateInventory`);


    printLog(`Inventory : Exit updateInventory`);
}
