const notifyHelper = require('../helpers/admin/notify-helper');

exports.getAdminUserNotify = async (req, res, next) => {
    if(!req.userInfo || req.userInfo.rank != 1) {
        res.redirect('/admin/login');
        return;
    }

    try {
        // Get query Param
        const mail = req.query.mail || null;

        res.render('notify', {
            pageTitle: 'Notify',
            mail: mail,
            error: false
        });
    } catch (err) {
        res.render('notify', {
            pageTitle: 'Notify',
            mail: null,
            error: err
        });
    }
}

exports.postAdminUserNotify = async (req, res, next) => {
    if(!req.userInfo || req.userInfo.rank != 1) {
        res.redirect('/admin/login');
        return;
    }

    try {
        const result = await notifyHelper.adminUserNotifyHelper(req);

        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
}