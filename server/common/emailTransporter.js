const nodemailer = require("nodemailer");

const EmailTransporter = nodemailer.createTransport({
  host: process.env.AWS_SES_HOST,
  port: process.env.AWS_SES_PORT,
  secure: true,
  auth: {
    user: process.env.AWS_SES_USER,
    pass: process.env.AWS_SES_PASS,
  },
});

const verifyEmailTransport = () => {
  EmailTransporter.verify(function (err, success) {
    if (err) {
      console.log(err);
    } else {
      console.log("Email Server is ready to take our messages");
    }
  });
};

module.exports = {
    EmailTransporter,
    verifyEmailTransport
}
