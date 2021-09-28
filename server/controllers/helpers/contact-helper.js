const { check, validationResult } = require("express-validator");
const Filter = require('bad-words');
const { EmailTransporter } = require("../../common/emailTransporter");
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
        EmailTransporter.sendMail({
            to: 'adtol.com@gmail.com',
            from: 'support@adtol.com',
            subject: `Alert - You Got a New Message From ${name}`,
            html: `
                This is to inform you that you have got a new message on AdTol.
                Here's the transcript of the message - 

                <div><b>Name:</b> ${name}</div>
                <div><b>Email:</b> ${email}</div>
                <div><b>Subject:</b> ${subject}</div>
                <div><b>Message:</b> ${message}</div>

                <span style="display:block">click here to reply -</span>
                <a href="mailto:${email}?subject=RE:${subject}"
                style="box-sizing:border-box;-webkit-appearance:none;-moz-appearance:none;appearance:none;
                background-color:#3f51b5;border-radius:4px;
                color:#fff;cursor:pointer;display:inline-block;font-size:14px;font-weight:400;
                line-height:1;margin:10px;padding:10px 15px;text-decoration:none;text-align:center;
                text-transform:uppercase;font-family:Montserrat,sans-serif;font-weight:700">Reply</a>
                <br />
            `
        }).catch(e => { console.log(e); });

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