const authHelper = require('../helpers/auth-helper');

exports.getAdminLogin = async (req, res, next) => {
    if(req.userInfo && req.userInfo.rank == 1) {
        res.redirect('/admin');
        return;
    }

    try {
        res.render('login', {
            pageTitle: 'Login',
            error: false
        });

    } catch(err) {
        // Render error
        res.render('login', {
            pageTitle: 'Login',
            error: err
        })
    }
}

exports.postAdminLogin = async (req, res, next) => {
    try {
        const result = await authHelper.loginHelper(req);

        res.cookie('adminAuth', 'Authorization ' + result.token, { maxAge: 1000*60*60*24*90, secure: false, httpOnly: true, path: '/admin' });
        res.redirect('/admin');
        return;

    } catch (err) { console.log(err);
        res.render('login', {
            pageTitle: 'Login',
            error: err
        })
    }
}