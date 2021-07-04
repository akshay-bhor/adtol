const paymentsHelper = require('../helpers/dashboard/payments-helper');

exports.createOrder = async (req, res, next) => {
    try {
        const result = await paymentsHelper.createOrderHelper(req);
        
        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
}

exports.verifyPayment = async (req, res, next) => {
    try {
        const result = await paymentsHelper.verifyPaymentHelper(req);
        
        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
}