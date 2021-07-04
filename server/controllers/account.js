const accountHelper = require('./helpers/account-helper');

exports.accountInfo = async (req, res, next) => {
    try {
        const result = await accountHelper.accountInfoHelper(req);

        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
}

exports.editAccountDetails = async (req, res, next) => {
    try {
        const result = await accountHelper.editAccountDetailsHelper(req);

        res.status(200).json(result);
        
    } catch (err) {
        next(err);
    }
}

exports.editPayment = async (req, res, next) => {
    try {
        const result = await accountHelper.editPaymentHelper(req);

        res.status(200).json(result);
        
    } catch (err) {
        next(err);
    }
}