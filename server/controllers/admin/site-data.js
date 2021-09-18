const siteDataHelper = require('../helpers/admin/site-data-helper');

exports.getSiteData = async (req, res, next) => {
    if(!req.userInfo || req.userInfo.rank != 1) {
        res.redirect('/admin/login');
        return;
    }

    try {
        const result = await siteDataHelper.getSiteDataHelper(req);
        
        res.render('site-data', {
            pageTitle: 'Site Data',
            data: result,
            error: false
        })

    } catch (err) {
        res.render('site-data', {
            pageTitle: 'Site Data',
            error: err
        })
    }
}