const summaryHelper  = require('../helpers/dashboard/summary-helper');

exports.summary = async(req, res, next) => {
    try {
        const result = await summaryHelper.summaryHelper(req);
        
        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
}