const usersHelper = require('../helpers/admin/users-helper');

exports.getAdminUsersList = async (req, res, next) => {
    if(!req.userInfo || req.userInfo.rank != 1) {
        res.redirect('/admin/login');
        return;
    }

    try {
        res.render('users', {
            pageTitle: 'Users',
            error: false
        });
    } catch (err) {
        res.render('users', {
            pageTitle: 'Users',
            error: err
        });
    }
}

exports.postAdminUsersList = async (req, res, next) => {
    if(!req.userInfo || req.userInfo.rank != 1) {
        res.redirect('/admin/login');
        return;
    }

    try {
        const result = await usersHelper.adminUsersListHelper(req);

        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
}

exports.postAdminUserStatusChange = async (req, res, next) => {
    if(!req.userInfo || req.userInfo.rank != 1) {
        res.redirect('/admin/login');
        return;
    }

    try {
        const result = await usersHelper.adminUserStatusChangeHelper(req);

        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
}

exports.postAdminAdjustUserBalance = async(req, res, next) => {
    if(!req.userInfo || req.userInfo.rank != 1) {
        res.redirect('/admin/login');
        return;
    }

    try {
        const result = await usersHelper.adminAdjustUserBalanceHelper(req);

        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
}