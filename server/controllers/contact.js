const contactHelper = require('./helpers/contact-helper');

exports.sendMessage = async (req, res, next) => {
    try {
        const result = await contactHelper.sendMessageHelper(req);

        res.status(200).json(result);
        
    } catch (err) {
        next(err);
    }
}