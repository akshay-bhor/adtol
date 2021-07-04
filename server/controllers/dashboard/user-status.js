const userStatusHelper = require('../helpers/dashboard/user-status-helper');

exports.userStatus = async (req, res, next) => {
    try {
        const result = await userStatusHelper.userStatusHelper(req);

        res.status(200).json(result);
        
    } catch (err) {
        next(err);
    }
}