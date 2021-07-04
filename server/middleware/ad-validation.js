const { decryptAES } = require('../common/encrypt');

module.exports = async (req, res, next) => {

    try {
        // Get token from path param
        const adToken = req.params.ad_token;

        // Check validity of token
        const decodedToken = JSON.parse(decryptAES(adToken));

        if(!decodedToken || decodedToken.type != 'adcode') {
            throw new Error('Invalid Ad Code!');
        }
        /** 
         * Note: Should I verify all data is present or not?
         * very low chance it is tempered with
         */

        // Join it to request object
        req.webInfo = decodedToken;
        next();

    } catch (err) {
        if(!err.statusCode)
            err.statusCode = 500;
        return next(err);
    }
}