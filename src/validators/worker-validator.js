const {param, body} = require("express-validator");

const workerCreateValidator = [
    body("name")
        .trim()
        .isLength({min: 3})
        .withMessage("Please enter a Title of Min 3 Characters."),

    body("phone")
        .trim()
        .isLength({min: 10})
        .withMessage("Please enter a phone."),

    body("address")
        .isLength({min: 3})
        .withMessage("Please enter an Address."),
    
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please enter an email."),
    
    body("avail_per_day")
        .trim()
        .withMessage("Please enter Availabilty Per Day."),
    
    body("cost_per_hr")
        .trim()
        .withMessage("Please enter Cost Per Hour."),

    body("total_avail_per_week")
        .trim()
        .isInt()
        .withMessage("Please enter Total Avaialbilty Per Week."),
    
    body("professionId")
        .trim()
        .isInt()
        .withMessage("Please enter Profession ID."),
]

const validateReq = [
    param("id", 'Enter a valid Id').isFloat()
];

module.exports = {
    workerCreateValidator: workerCreateValidator,
    validateReq: validateReq
}