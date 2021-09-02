const { check, validationResult } = require("express-validator");
const { QueryTypes } = require("sequelize");
const { App_Settings } = require("../../common/settings");
const User = require("../../models/users");
const User_Info = require("../../models/user_info");
const sequelize = require("../../utils/db");

exports.accountInfoHelper = async (req) => {
    if(!req.userInfo) {
        const err = new Error('Not Allowed!');
        err.statusCode = 401;
        throw err;
    }

    try {

        // Userid
        const userid = req.userInfo.id;

        // Get user data
        const udata = await sequelize.query('SELECT u.name, u.surname, u.mobile, u.country, u.status, ui.paypal, ui.ac_no as acno, ui.bank, ui.ifsc, ui.branch, ui.upi, ui.payoneer FROM users u INNER JOIN user_info ui ON u.id = ui.uid WHERE u.id = ? LIMIT 1', {
            type: QueryTypes.SELECT,
            replacements: [userid]
        });

        // Get country
        const ccode = udata[0].country;
        const country = App_Settings.countries[ccode][1];

        // Return
        return {
            ...udata[0],
            country
        };

    } catch (err) {
        if(!err.statusCode)
            err.statusCode = 500;
        throw err;
    }
}

exports.editAccountDetailsHelper = async (req) => {
    if(!req.userInfo) {
        const err = new Error('Not Allowed!');
        err.statusCode = 401;
        throw err;
    }

    if(req.body.name)
        await check('name').trim().escape().isAlpha().withMessage('Only letters allowed in name!').run(req);
    if(req.body.surname)
        await check('surname').trim().escape().isAlpha().withMessage('Only letters allowed in last name!').run(req);
    await check('mobile').trim().escape().isMobilePhone().withMessage('Invalid Mobile Number!').run(req);

    try {
        const errs = validationResult(req);
        if(!errs.isEmpty()) {
            const err = new Error('Validation Failed!');
            err.statusCode = 422;
            err.data = errs.array();
            throw err;
        }

        // Userid
        const userid = req.userInfo.id;

        // Request data
        const name = req.body.name || null;
        const surname = req.body.surname || null;
        const mobile = req.body.mobile;

        // Update
        const update = await User.update({
            name: name,
            surname: surname,
            mobile: mobile
        }, {
            where: {
                id: userid
            }
        });

        // Return
        return {
            msg: 'Success'
        };

    } catch(err) {
        if(!err.statusCode)
            err.statusCode = 500;
        throw err;
    }
}

exports.editPaymentHelper = async (req) => {
    if(!req.userInfo) {
        const err = new Error('Not Allowed!');
        err.statusCode = 401;
        throw err;
    }

    if(req.body.paypal)
        await check('paypal').trim().escape().run(req);
    if(req.body.payoneer)
        await check('payoneer').trim().escape().run(req);
    if(req.body.upi)
        await check('upi').trim().escape().run(req);
    if(req.body.bank) {
        await check('bank').exists().notEmpty().withMessage('Bank is required!').trim().escape().isString().withMessage('Invalid Bank Name!').run(req);
        await check('acno').exists().notEmpty().withMessage('Account Number is required!').trim().escape().isNumeric().withMessage('Invalid Account Number!').run(req);
        await check('branch').exists().notEmpty().withMessage('Branch is required!').trim().escape().isAlpha().withMessage('Invalid Branch Name!').run(req);
        await check('ifsc').exists().notEmpty().withMessage('IFSC Code is required!').trim().escape().isAlphanumeric().withMessage('Invalid IFSC Number!').run(req);
    }

    try {
        const errs = validationResult(req);
        if(!errs.isEmpty()) {
            const err = new Error('Validation Failed!');
            err.statusCode = 422;
            err.data = errs.array();
            throw err;
        }

        // Userid
        const userid = req.userInfo.id;

        // Req params
        const paypal = req.body.paypal || null;
        const payoneer = req.body.payoneer || null;
        const bank = req.body.bank || null;
        const ifsc = bank !== null ? req.body.ifsc : null;
        const branch = bank !== null ? req.body.branch : null;
        const acno = bank !== null ? req.body.acno : null;
        const upi = req.body.upi || null;

        // Update
        const update = await User_Info.update({
            paypal: paypal,
            payoneer: payoneer,
            bank: bank,
            ifsc: ifsc,
            branch: branch,
            ac_no: acno,
            upi: upi
        }, {
            where: {
                uid: userid
            }
        });

        // Return
        return {
            msg: "Success"
        };

    } catch(err) {
        if(!err.statusCode)
            err.statusCode = 500;
        throw err;
    }
}