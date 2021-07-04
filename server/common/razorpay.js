const Razorpay = require('razorpay');

exports.razorPay = new Razorpay({
    key_id: process.env.PAY_KEY_ID,
    key_secret: process.env.PAY_KEY_SECRET
});