const sgMail = require("@sendgrid/mail");
const { SENDGRID_API_KEY } = require("../util/config");

sgMail.setApiKey(`SG.${SENDGRID_API_KEY}`);

module.exports = sgMail;
