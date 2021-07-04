const nodemailer = require('nodemailer');

let transporter;

exports.createEmailTransport = async () => {
    // transporter = nodemailer.createTransport({
    //     service: "Gmail",
    //     auth: {
    //         user: process.env.EMAIL_USER,
    //         pass: process.env.EMAIL_PASS,
    //     }
    // });
    // transporter.verify(function(err, success) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         console.log("Email Server is ready to take our messages");
    //     }
    // });
}

exports.EmailTransporter = transporter;