const nodemailer = require("nodemailer");
const AWS = require('aws-sdk');

const AWS_SES_CREDENTIALS = new AWS.Credentials(process.env.AWS_SES_ACCESS_KEY, process.env.AWS_SES_SECRET_KEY);

const SES = new AWS.SES({
  apiVersion: "2010-12-01",
  credentials: AWS_SES_CREDENTIALS,
  region: process.env.AWS_SES_REGION,
});

const EmailTransporter = nodemailer.createTransport({
  SES: SES,
  sendingRate: process.env.EMAIL_SENDING_RATE
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
