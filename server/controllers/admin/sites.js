const adminSitesHelper = require('../helpers/admin/sites-helper');

exports.getSiteList = async (req, res, next) => {
    if(!req.userInfo || req.userInfo.rank != 1) {
        res.redirect('/admin/login');
        return;
    }

    try {
        res.render('sites', {
            pageTitle: 'User Sites',
            error: false
        })

    } catch(err) {
        res.render('sites', {
            pageTitle: 'User Sites',
            error: err
        });
    }
}

exports.postSiteList = async (req, res, next) => {
    if(!req.userInfo || req.userInfo.rank != 1) {
        res.redirect('/admin/login');
        return;
    }

    try {
        const result = await adminSitesHelper.adminSitesListHelper(req);

        res.status(200).json(result);

    } catch(err) {
        next(err);
    }
}

exports.postChangeSiteStatus = async (req, res, next) => {
    if(!req.userInfo || req.userInfo.rank != 1) {
        res.redirect('/admin/login');
        return;
    }

    try {
        const result = await adminSitesHelper.adminChangeSiteStatus(req);

        res.status(200).json(result);

    } catch(err) {
        next(err);
    }
}