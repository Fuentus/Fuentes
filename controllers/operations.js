const db = require('../models/');
const printLog = require('../util/fuentis_util');
const Operations = db.Operations;

exports.createOperation = (req, res, next) => {
    printLog(`Operations : Inside createOperation`);


    printLog(`Operations : Exit createOperation`);
}

exports.getOperation = (req, res, next) => {
    printLog(`Operations : Inside getOperation`);


    printLog(`Operations : Exit getOperation`);
}

exports.getOneOperation = (req, res, next) => {
    printLog(`Operations : Inside getOneOperation`);


    printLog(`Operations : Exit getOneOperation`);
}

exports.deleteOperation = (req, res, next) => {
    printLog(`Operations : Inside deleteOperation`);


    printLog(`Operations : Exit deleteOperation`);
}

exports.updateOperation = (req, res, next) => {
    printLog(`Operations : Inside updateOperation`);


    printLog(`Operations : Exit updateOperation`);
}
