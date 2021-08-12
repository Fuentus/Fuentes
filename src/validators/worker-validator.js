const {param, body} = require("express-validator");
const { Users,Workers } = require("../models");

const workerCreateValidator = [
    body("name")
        .trim()
        .isLength({min: 3})
        .withMessage("Please enter a Title of Min 3 Characters."),

    body("phone")
        .trim()
        .isLength({min: 10})
        .withMessage("Please enter a valid phone number."),

    body("address")
        .isLength({min: 3})
        .withMessage("Please enter an Address."),
    
    body("email")
        .isEmail()
        .withMessage("Please enter a valid email.")
        .custom((value, { req }) => {
            return Users.findOne({ where: { email: value } }).then((userDoc) => {
                if (userDoc) {
                    return Promise.reject("E-Mail address already exists in Users!");
                }
                return Workers.findOne({ where: { email: value } })
            }).then((userDoc) => {
                if (userDoc) {
                    return Promise.reject("E-Mail address already exists in Workers!");
                }
            });
        })
        .normalizeEmail(),
    
    body("avail_per_day")
        .trim()
        .isNumeric()
        .withMessage("Please enter Availabilty Per Day."),
    
    body("cost_per_hr")
        .trim()
        .isNumeric()
        .withMessage("Please enter Cost Per Hour."),

    body("total_avail_per_week")
        .trim()
        .isNumeric()
        .withMessage("Please enter Total Avaialbilty Per Week."),

    body("professionId")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Profession Shouldn't be Empty"),
]

const validateReq = [
    param("id", 'Enter a valid Id').isFloat()
];

module.exports = {
    workerCreateValidator: workerCreateValidator,
    validateReq: validateReq
}