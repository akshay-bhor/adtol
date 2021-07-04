const reportsHelper = require('../helpers/dashboard/reports-helper');

exports.reports = async (req, res, next) => {
    try {
        const result = await reportsHelper.reportsHelper(req);
        
        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
}