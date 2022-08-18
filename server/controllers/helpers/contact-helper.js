const { check, validationResult } = require("express-validator");
const Filter = require('bad-words');
const { sendContactMail } = require("../../common/sendMails");
const filter = new Filter();

exports.sendMessageHelper = async (req) => {
    await check('name').exists().trim().escape().isString('Only words allowed in name').withMessage('Name is required').isLength({min:3, max:25}).withMessage('Min Name Character limit is 3, Max limit 25').run(req);
    await check('email').exists().trim().isEmail().withMessage('Invalid Email').normalizeEmail().run(req);
    await check('subject').exists().trim().escape().withMessage('Subject is required').isLength({min:3, max:60}).withMessage('Min Subject Character limit is 3, Max limit 60').run(req);
    await check('message').exists().trim().escape().withMessage('Message is required').isLength({min:5, max:500}).withMessage('Min Message Character limit is 5, Max limit 500').run(req);

    try {
        const errs = validationResult(req);
        if(!errs.isEmpty()) {
            const err = new Error('Validation Error!');
            err.statusCode = 422;
            err.data = errs.array();
            throw err;
        }

        const name = req.body.name;
        const email = req.body.email;
        const subject = req.body.subject;
        const message = req.body.message;

        if(filter.isProfane(`${name} ${email} ${message}`)) {
            const err = new Error('Your name, email, or message contains profanity, keeping up use of such language could lead to your ban, please refrain from such activity!');
            err.statusCode = 422;
            throw err;
        }

        // Send Email
        sendContactMail(email, name, subject, message);

        // return object
        return {
            msg: 'Success'
        };

    } catch(err) {
        if(!err.statusCode)
            err.statusCode = 500;
        throw err;
    }
}
