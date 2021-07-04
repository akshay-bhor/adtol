const authHelper = require('./helpers/auth-helper');

exports.register = async (req, res, next) => { 
    try {
        const result = await authHelper.registerHelper(req);
        
        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
}

exports.login = async (req, res, next) => {
    try {
        const result = await authHelper.loginHelper(req);

        res.status(200).json(result);
        
    } catch (err) {
        next(err);
    }
}

exports.glogin = async (req, res, next) => {
    try {
        const result = await authHelper.gLoginHelper(req);

        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
}

exports.changePass = async (req, res, next) => {
    try {
        const result = await authHelper.changePassHelper(req);

        res.status(200).json(result);
        
    } catch (err) {
        next(err);
    }
}

exports.forgetPass = async (req, res, next) => {
    try {
        const result = await authHelper.forgetPassHelper(req);

        res.status(200).json(result);
        
    } catch (err) {
        next(err);
    }
}

exports.resetPass = async(req, res, next) => {
    try {
        const result = await authHelper.resetPassHelper(req);

        res.status(200).json(result);
        
    } catch (err) {
        next(err);
    }
}

exports.formData = async(req, res, next) => {
    try {
        const result = await authHelper.formdataHelper(req);

        res.status(200).json(result);
        
    } catch (err) {
        next(err);
    }
}