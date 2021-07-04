const adminPaymentsHelper = require('../helpers/admin/payments-helper');

exports.getPaymentsList = async (req, res, next) => {
    if(!req.userInfo || req.userInfo.rank != 1) {
        res.redirect('/admin/login');
        return;
    }

    try {
        res.render('payments', {
            pageTitle: 'Payments',
            error: false
        })

    } catch(err) {
        res.render('payments', {
            pageTitle: 'Payments',
            error: err
        });
    }
}

exports.postPaymentsList = async (req, res, next) => {
    if(!req.userInfo || req.userInfo.rank != 1) {
        res.redirect('/admin/login');
        return;
    }

    try {
        const result = await adminPaymentsHelper.adminPaymentsListHelper(req);

        res.status(200).json(result);

    } catch(err) {
        next(err);
    }
}