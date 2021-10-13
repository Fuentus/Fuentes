const {param, body} = require("express-validator");
const db = require("../models/index");
const Operation = db.Operation;

const operationCreateValidator = [
    body("name")
        .trim()
        .isLength({min: 3})
        .withMessage("Please enter a Title of Min 3 Characters."),

    body("desc")
        .trim()
        .isLength({min: 3})
        .withMessage("Please enter a Description."),

    body("items").isArray({min: 1}).withMessage("Please add items"),

    //body("workers").isArray({min: 1}).withMessage("Please add workers"),
]

const validateReq = [
    param("id", 'Enter a valid Id').isFloat()
];

module.exports = {
    operationCreateValidator: operationCreateValidator,
    validateReq: validateReq
}