const axios = require("axios");

module.exports = async (req, res, next) => {
    try {
        // Get grecaptcha
        const google_captcha = req.body.grecaptcha;
        if(!google_captcha) {
            const err = new Error('Invalid Captcha!');
            err.statusCode = 422;
            throw err;
        }

        // Verify captcha
        const secret = process.env.RECAPTCHA_SECRET;
        const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${google_captcha}`;
        
        const result = await axios.post(url);
        
        if(result.data.success === true) {
            next();
        }
        else {
            const err = new Error('Captcha Valiation Failed, Try Again!');
            err.statusCode = 422;
            throw err;
        }

    } catch (err) {
        if(!err.statusCode)
            err.statusCode = 500;
        return next(err);
    }
}