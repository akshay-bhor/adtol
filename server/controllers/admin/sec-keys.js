const secKeysHelper = require('../helpers/admin/sec-keys-helper');

exports.secKeys = async (req, res, next) => {
    if(!req.userInfo || req.userInfo.rank != 1) {
        res.redirect('/admin/login');
        return;
    }

    try {
        res.render('keys', {
            pageTitle: 'Security Keys',
            error: false
        })

    } catch(err) {
        res.render('keys', {
            pageTitle: 'Security Keys',
            error: err
        });
    }
}

exports.genKeys = async (req, res, next) => {
    if(!req.userInfo || req.userInfo.rank != 1) {
        res.redirect('/admin/login');
        return;
    }

    try {
        const result = await secKeysHelper.genSecKeysHelper(req);

        res.status(200).json(result);

    } catch(err) {
        next(err);
    }
}