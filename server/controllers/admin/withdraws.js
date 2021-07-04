const adminWithdrawHelper = require('../helpers/admin/withdraw-helper');

exports.getWithdrawList = async (req, res, next) => {
    if(!req.userInfo || req.userInfo.rank != 1) {
        res.redirect('/admin/login');
        return;
    }

    try {
        res.render('withdraws', {
            pageTitle: 'Withdraws',
            error: false
        })

    } catch(err) {
        res.render('withdraws', {
            pageTitle: 'Withdraws',
            error: err
        });
    }
}

exports.postWithdrawsList = async (req, res, next) => {
    if(!req.userInfo || req.userInfo.rank != 1) {
        res.redirect('/admin/login');
        return;
    }

    try {
        const result = await adminWithdrawHelper.adminWithdrawsListHelper(req);

        res.status(200).json(result);

    } catch(err) {
        next(err);
    }
}

exports.postChangeWithdrawStatus = async (req, res, next) => {
    if(!req.userInfo || req.userInfo.rank != 1) {
        res.redirect('/admin.login');
    }

    try {
        const result = adminWithdrawHelper.adminChangeWithdrawsStatusHelper(req);

        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
}