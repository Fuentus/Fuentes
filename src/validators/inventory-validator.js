const {param, body} = require("express-validator");
const db = require("../models/index");
const Inventory = db.Inventory;

const inventoryCreateValidator = [
    body("itemName")
        .trim()
        .isLength({min: 3})
        .withMessage("Please enter a Title of Min 3 Characters."),

    body("itemDesc")
        .trim()
        .isLength({min: 3})
        .withMessage("Please enter a Description."),

    body("availability")
        .isNumeric()
        .withMessage("Please enter availability."),

    body("cost")
        .isNumeric()
        .withMessage("Please enter cost."),

    body("supplier_email")
        .isEmail()
        .withMessage("Please enter supplier email."),
]

const validateReq = [
    param("id", 'Enter a valid Id').isFloat()
];

module.exports = {
    inventoryCreateValidator: inventoryCreateValidator,
    validateReq: validateReq
}