const User = require('../../../models/users');
const { EmailTransporter } = require('../../../common/emailTransporter');

exports.adminUserNotifyHelper = async (req) => {
    if (!req.userInfo || req.userInfo.rank != 1) {
        const err = new Error("Not allowed!");
        err.statusCode = 401;
        throw err;
    }

    try {

        // Get params
        let emails = req.body.to.split(',') || [];
        const all = req.body.all || 0;
        const msg = req.body.msg;
        const subject = 'AdTol - ' + (req.body.subject || null);

        if(all == 1) {
            // Get all emails
            const aMails = await User.findAll({ where: { status: 1 }, attributes: ['mail'] });

            aMails.forEach(d => {
                emails.push(d.dataValues.mail);
            });
        }

        // Send mail
        for(let mail of emails) {
            EmailTransporter.sendMail({
                to: mail,
                from: 'support@adtol.com',
                subject: subject,
                html: `
                    ${msg}
                `
            }).catch(e => { console.log(e); });
        }

        return {
            msg: 'success'
        }

    } catch (err) {
        if(!err.statusCode)
            err.statusCode = 500;
        throw err;
    }
}
