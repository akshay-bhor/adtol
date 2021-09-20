const ratesLimitsHelper = require('../helpers/admin/rates-limits-helper');

exports.getRatesLimits = async (req, res, next) => {
    if(!req.userInfo || req.userInfo.rank != 1) {
        res.redirect('/admin/login');
        return;
    }

    try {
        const result = await ratesLimitsHelper.getRatesLimitsHelper(req);
        
        res.render('rates', {
            pageTitle: 'Rates & Limits',
            data: result,
            error: false
        })

    } catch (err) {
        res.render('rates', {
            pageTitle: 'Rates & Limits',
            error: err
        })
    }
}

exports.postRatesLimits = async (req, res, next) => {
    if(!req.userInfo || req.userInfo.rank != 1) {
        res.redirect('/admin/login');
        return;
    }

    try {
        const result = await ratesLimitsHelper.postRatesLimitsHelper(req);

        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
}