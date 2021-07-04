const referrelHelper = require('../helpers/dashboard/referrel-helper');

exports.referrels = async (req, res, next) => {
    try {
        const result = await referrelHelper.referrelsHelper(req);
        
        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
}