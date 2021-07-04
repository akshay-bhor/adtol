const advertiserHelper = require('../helpers/dashboard/advertiser-helper');

exports.advertiser = async(req, res, next) => {  
    try {
        const result = await advertiserHelper.advertiserHelper(req);
        
        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
}