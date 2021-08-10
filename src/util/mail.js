// import  * as emailjs from 'emailjs'

// export const Mailer = emailjs.server.connect({
//     user: "subinthreestops@gmail.com",
//     password: "subin3stops",
//     host: "smtp.gmail.com",
//     ssl: true
// });

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey("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");


//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
module.exports = sgMail;

// console.log('send msg')
//     const msg = {
//         to: 'subinbthomas5@gmail.com',
//         from : 'subinthreestops@gmail.com',
//         subject: 'Quote Sucessfully added',
//         text: "Quote Sucessfully added"
//     }
//     sgMail
//         .send(msg)
//         .then(() => {
//             console.log('1st Quote Mail Sent')
//         })
//         .catch((error) => {
//             console.log(error)
//         })
//         console.log('send msg done')