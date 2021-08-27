const campaignsHelper = require('../helpers/dashboard/campaigns-helper');

exports.campaigns = async(req, res, next) => {
    try {
        const result = await campaignsHelper.campaignsHelper(req);
        
        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
}

exports.changeStatus = async (req, res, next) => {
    try {
        const result = await campaignsHelper.changeStatusHelper(req);
        
        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
}

exports.changeBudget = async (req, res, next) => {
    try {
        const result = await campaignsHelper.changeBudgetHelper(req);
        
        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
}

exports.uploadBanners = async (req, res, next) => {
    try {
        const result = await campaignsHelper.uploadBannersHelper(req);

        res.status(200).json(result);

    } catch (err) {
        next(err)
    }
}

exports.getCampaigntypes = async (req, res, next) => {
    try {
        const result = await campaignsHelper.getCampaignTypesHelper(req);

        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
}

exports.getTimezones = async (req, res, next) => {
    try {
        const result = await campaignsHelper.getTimezonesHelper(req);

        res.status(200).json(result);
        
    } catch (err) {
        next(err);
    }
}