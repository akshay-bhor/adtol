const billingHelper = require('../helpers/dashboard/billing-helper');

exports.payHistory = async(req, res, next) => {
    try {
        const result = await billingHelper.payHistoryHelper(req);
        
        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
}

exports.withdrawHistory = async (req, res, next) => {
    try {
        const result = await billingHelper.withdrawHistoryHelper(req);
        
        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
}

exports.formData = async (req, res, next) => {
    try {
        const result = await billingHelper.formDataHelper(req);
        
        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
}

exports.withdraw = async (req, res, next) => {
    try {
        const result = await billingHelper.withdrawHelper(req);
        
        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
}

exports.convertPubBal = async (req, res, next) => {
    try {
        const result = await billingHelper.convertPubBalHelper(req);
        
        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
}
