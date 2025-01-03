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

exports.trafficEstimattion = async (req, res, next) => {
    try {
        const result = await campaignsHelper.trafficEstimationHelper(req);
        
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

exports.createCampaign = async (req, res, next) => {
    try {
        // Add type
        req.manage = 'create';

        const result = await campaignsHelper.manageCampaignHelper(req);

        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
}

exports.editCampaign = async (req, res, next) => {
    try {
        // Add type
        req.manage = 'edit';

        const result = await campaignsHelper.manageCampaignHelper(req);

        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
}

exports.getCampaignInfo = async (req, res, next) => {
    try {

        const result = await campaignsHelper.getCampaignInfoHelper(req);

        res.status(200).json(result);

    } catch (err) {
        next(err);
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

exports.getCampaignBanners = async (req, res, next) => {
    try {
        const result = await campaignsHelper.getCampaignBannersHelper(req);

        res.status(200).json(result);
        
    } catch (err) {
        next(err);
    }
}

exports.getCampaignFormData = async (req, res, next) => {
    try {
        const result = await campaignsHelper.getCampaignFormDataHelper(req);

        res.status(200).json(result);
        
    } catch (err) {
        next(err);
    }
}