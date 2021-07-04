
exports.home = async (req, res, next) => {
    if(!req.userInfo || req.userInfo.rank != 1) {
        res.redirect('/admin/login');
        return;
    }

    try {
        res.render('index', {
            pageTitle: 'Admin Panel', 
            error: false
        });

    } catch(err) {
        // Render error
        res.render('index', {
            pageTitle: 'Admin Panel', 
            error: err
        })
    }
}