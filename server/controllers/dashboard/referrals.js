const referralHelper = require('../helpers/dashboard/referral-helper');

exports.referrals = async (req, res, next) => {
    try {
        const result = await referralHelper.referralsHelper(req);
        
        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
}