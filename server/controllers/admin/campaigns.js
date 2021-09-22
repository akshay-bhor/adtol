const campaignsDataHelper = require('../helpers/admin/campaigns-helper');

exports.getCampaignsData = async (req, res, next) => {
    if(!req.userInfo || req.userInfo.rank != 1) {
        res.redirect('/admin/login');
        return;
    }

    try {
        
        res.render('campaigns', {
            pageTitle: 'Campaigns',
            error: false
        })

    } catch (err) {
        res.render('campaigns', {
            pageTitle: 'Campaigns',
            error: err
        })
    }
}

exports.postCampaignsData = async (req, res, next) => {
    if(!req.userInfo || req.userInfo.rank != 1) {
        res.redirect('/admin/login');
        return;
    }

    try {
        const result = await campaignsDataHelper.getCampaignsListHelper(req);

        res.status(200).json(result);

    } catch(err) {
        next(err);
    }
}

exports.setCampaignStatus = async (req, res, next) => {
    if(!req.userInfo || req.userInfo.rank != 1) {
        res.redirect('/admin/login');
        return;
    }

    try {
        const result = await campaignsDataHelper.setCampaignStatusHelper(req);

        res.status(200).json(result);

    } catch(err) {
        next(err);
    }
}

exports.getCampaignBanners = async (req, res, next) => {
    if(!req.userInfo || req.userInfo.rank != 1) {
        res.redirect('/admin/login');
        return;
    }

    try {
        const result = await campaignsDataHelper.getCampaignBannersHelper(req);

        res.status(200).json(result);

    } catch(err) {
        next(err);
    }
}

exports.getTogglePro = async (req, res, next) => {
    if(!req.userInfo || req.userInfo.rank != 1) {
        res.redirect('/admin/login');
        return;
    }

    try {
        const result = await campaignsDataHelper.getToggleProHelper(req);

        res.status(200).json(result);

    } catch(err) {
        next(err);
    }
}