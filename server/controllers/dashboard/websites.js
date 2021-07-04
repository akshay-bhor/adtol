const websitesHelper = require('../helpers/dashboard/websites-helper');

exports.websites = async (req, res, next) => {
    try {
        const result = await websitesHelper.websitesHelper(req);
        
        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
}

exports.addWebsite = async (req, res, next) => {
    try {
        const result = await websitesHelper.addWebsiteHelper(req);
        
        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
}

exports.editWebsite = async (req, res, next) => {
    try {
        const result = await websitesHelper.editWebsiteHelper(req);
        
        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
}

exports.getAdcode = async (req, res, next) => {
    try {
        const result = await websitesHelper.getAdcodeHelper(req);
        
        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
}

exports.formdata = async (req, res, next) => {
    
    try {
        const result = await websitesHelper.formdataHelper(req);
        
        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
}