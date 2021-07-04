const publisherHelper = require('../helpers/dashboard/publisher-helper');

exports.publisher = async(req, res, next) => {  
    try {
        const result = await publisherHelper.publisherHelper(req);
        
        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
}