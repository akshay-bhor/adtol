const { check, validationResult } = require('express-validator');
const { QueryTypes } = require('sequelize');
const { sendWdStatusMail, sendPaymentSuccessMail } = require('../../../common/sendMails');
const { createUniquePaymentId } = require('../../../common/util');
const Payments = require('../../../models/payments');
const Settings = require('../../../models/settings');
const User = require('../../../models/users');
const Withdraw = require('../../../models/withdraw');
const sequelize = require('../../../utils/db');

exports.payHistoryHelper = async(req) => {
    if(!req.userInfo) {
        const err = new Error('Not Allowed!');
        err.statusCode = 401;
        throw err;
    }

    // if(req.query.p)
    //     await check('p').trim().escape().isInt().withMessage('Invalid Page!').run(req);

    try {
        // const errs = validationResult(req);
        // if(!errs.isEmpty()) {
        //     const err = new Error('Validation Failed!');
        //     err.statusCode = 422;
        //     err.data = errs.array();
        //     throw err;
        // }


        /**
         * Note:
         * Use luxon to handle time on front-end
         * send UTC unix time from server
         */

        // Userid
        const userid = req.userInfo.id;

        // Page
        // let page = 1;
        // if(req.query.p)
        //     page = req.query.p;

        // Per page Limit
        // const limit = 20;

        // offset
        // const offset = (page - 1) * limit;

        // Fetch
        // const payments = await sequelize.query('SELECT mtx, rzr_order_id, amount, currency, status, processor, time_unix FROM payments WHERE uid = ? ORDER BY id DESC LIMIT ? OFFSET ?', {
        //     type: QueryTypes.SELECT,
        //     replacements: [userid, limit, offset],
        //     mapToModel: Payments
        // });
        const pay_status = 'captured';
        const payments = await sequelize.query('SELECT mtx, rzr_order_id, amount, currency, status, processor, time_unix FROM payments WHERE uid = ? AND status = ? ORDER BY id DESC', {
            type: QueryTypes.SELECT,
            replacements: [userid, pay_status],
            mapToModel: Payments
        });

        let payData = [];
        payments.forEach(data => {
            let tmp = {};
            tmp.payment_id = data.mtx;
            tmp.order_id = data.rzr_order_id;
            tmp.amount = data.amount;
            tmp.currency = data.currency;
            tmp.status = 'Success';
            if(data.processor == 1)
                tmp.processor = 'Razorpay';
            if(data.processor == 2)
                tmp.processor = 'Publisher Balance';
            if(data.processor == 3)
                tmp.processor = 'System';
            tmp.time = data.time_unix;

            payData.push(tmp);
        });

        // Return
        return {
            data: payData
        };

    } catch (err) {
        if(!err.statusCode)
            err.statusCode = 500;
        throw err;;
    }
}

exports.withdrawHistoryHelper = async (req) => {
    if(!req.userInfo) {
        const err = new Error('Not Allowed!');
        err.statusCode = 401;
        throw err;
    }

    // if(req.query.p)
    //     await check('p').trim().escape().isInt().withMessage('Invalid Page!').run(req);

    try {
        // const errs = validationResult(req);
        // if(!errs.isEmpty()) {
        //     const err = new Error('Validation Failed!');
        //     err.statusCode = 422;
        //     err.data = errs.array();
        //     throw err;
        // }

        // Userid
        const userid = req.userInfo.id;

        // Page
        // let page = 1;
        // if(req.query.p)
        //     page = req.query.p;

        // Per page limit
        // const limit = 20;

        // offset
        // const offset = (page - 1) * limit;

        // Fetch
        // const withdraws = await sequelize.query('SELECT mtx, amount, currency, fee, status, processor, time_unix FROM withdraws WHERE uid = ? ORDER BY id DESC limit ? OFFSET ?', {
        //     type: QueryTypes.SELECT,
        //     replacements: [userid, limit, offset],
        //     mapToModel: Withdraw
        // });
        const withdraws = await sequelize.query('SELECT mtx, amount, currency, fee, status, processor, time_unix FROM withdraws WHERE uid = ? ORDER BY id DESC', {
            type: QueryTypes.SELECT,
            replacements: [userid],
            mapToModel: Withdraw
        });
        
        let wdData = [];
        withdraws.forEach(data => {
            let tmp = {};
            tmp.payment_id = data.mtx;
            tmp.amount = data.amount;
            tmp.currency = data.currency;
            tmp.fee = data.fee;
            tmp.status = data.status;
            if(data.status == 1)
                tmp.status = 'Success';
            if(data.status == 2)
                tmp.status = 'Pending';
            if(data.status == 3)
                tmp.status = 'Rejected';

            if(data.processor == 1)
                tmp.processor = 'Bank';
            else if(data.processor == 2)
                tmp.processor = 'Paypal';
            else if(data.processor == 3)
                tmp.processor = 'Payoneer';
            else if(data.processor == 4)
                tmp.processor = 'System';
            else    
                tmp.processor = 'NA';
            tmp.time = data.time_unix;

            wdData.push(tmp);
        });

        // Return
        return {
            data: wdData
        };

    } catch (err) {
        if(!err.statusCode)
            err.statusCode = 500;
        throw err;
    }
}

exports.formDataHelper = async (req) => {
    if(!req.userInfo) {
        const err = new Error('Not Allowed!');
        err.statusCode = 401;
        throw err;
    }

    try {
        
        // Userid
        const userid = req.userInfo.id;

        // Fetch publisher balance
        const bal = await User.findOne({ where: { id: userid }, attributes: ['pub_balance'] });
        
        const pub_bal = bal.dataValues.pub_balance;

        // Find settings
        let web_settings = await Settings.findAll();
        let tmp;
        web_settings.forEach(data => {
            tmp = {...data.dataValues}
        });
        web_settings = {...tmp};

        // Min deposit
        const min_deposit = web_settings.min_deposit;

        // Max deposit
        const max_deposit = web_settings.max_deposit;

        // Min withdrawal
        const min_withdraw = web_settings.min_withdraw;

        // Withdraw fee
        const withdraw_fee = web_settings.withdraw_fee;

        // Return
        return {
            pub_bal,
            min_deposit,
            max_deposit,
            min_withdraw,
            withdraw_fee
        };

    } catch(err) {
        if(!err.statusCode)
            err.statusCode = 500;
        throw err;
    }
}

exports.withdrawHelper = async (req) => {
    if(!req.userInfo) {
        const err = new Error('Not Allowed!');
        err.statusCode = 401;
        throw err;
    }

    await check('amt').exists().withMessage('Amount not specified!').trim().escape().isFloat().withMessage('Invalid amount format!')
    .custom(customWithdrawAmtValidation).run(req);
    await check('processor').exists().withMessage('Processor not specified!').trim().escape().isInt().withMessage('Invalid peocessor!')
    .custom(customProcessorValidation).run(req);

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
        const amt = req.body.amt;
        const processor = req.body.processor;

        // Get fee
        const getFee = await sequelize.query('SELECT withdraw_fee FROM settings', {
            type: QueryTypes.SELECT,
        });
        const fee = getFee[0].withdraw_fee;

        // Create Payment id
        const wdId = createUniquePaymentId('wd');

        // Time
        const time_unix = Math.floor(new Date().getTime() / 1000);

        // Create sequelize transaction
        const ts = await sequelize.transaction();

        try {
        // Create Withdraw Request
            const wdInsert = await Withdraw.create({
                uid: userid,
                mtx: wdId,
                amount: amt,
                processor: processor,
                fee: fee, 
                time_unix: time_unix
            }, { transaction: ts }); 

            // Deduct Publisher Balance
            const ures = await sequelize.query('UPDATE users SET pub_balance = pub_balance - ? WHERE id = ? LIMIT 1', {
                type: QueryTypes.UPDATE,
                replacements: [amt, userid],
                mapToModel: User,
                transaction: ts
            });

            await ts.commit();

        } catch (err) {
            await ts.rollback();
            throw new Error(err);
        }


        if(processor == 1)
            wProcessor = 'Bank';
        else if(processor == 2)
             wProcessor = 'Paypal';
        else if(processor == 3)
            wProcessor = 'Payoneer';
        else if(processor == 4)
            wProcessor = 'System';
        else    
            wProcessor = 'NA';

        // Send Mail
        sendWdStatusMail(req.userInfo.mail, req.userInfo.user, wdId, amt, fee, 'Pending', wProcessor);

        // Return
        return {
            msg: 'Success'
        };

    } catch (err) {
        if(!err.statusCode)
            err.statusCode = 500;
        throw err;
    }
}

exports.convertPubBalHelper = async (req) => {
    if(!req.userInfo) {
        const err = new Error('Not Allowed!');
        err.statusCode = 401;
        throw err;
    }

    await check('amt').exists().withMessage('Amount not specified!').trim().escape().isFloat().withMessage('Invalid Amount!')
    .custom(customDepositAmtValidation).run(req);

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

        // Amount
        const amount = req.body.amt;

        // Create payment id
        const mtx = createUniquePaymentId('pay');

        // Time
        const time_unix = Math.floor(new Date().getTime() / 1000);

        // Status
        const status = 'captured'

        // Processor
        const processor = 2;

        // Start Transaction
        const ts = await sequelize.transaction();
        try {
            // Create Payment
            const pay = await Payments.create({
                uid: userid,
                mtx,
                amount,
                processor, 
                status,
                time_unix
            }, { transaction: ts });

            // Deduct Publisher Balance and deposit Ad Balance
            const ures = await sequelize.query('UPDATE users SET pub_balance = pub_balance - ?, ad_balance = ad_balance + ? WHERE id = ? LIMIT 1', {
                type: QueryTypes.UPDATE,
                replacements: [amount, amount, userid],
                mapToModel: User,
                transaction: ts
            });

            await ts.commit();
        } catch (err) {
            await ts.rollback();
            throw new Error(err);
        }

        // Send Payment Success Mail 
        sendPaymentSuccessMail(req.userInfo.mail, req.userInfo.user, amount, mtx, 'Publisher Balance');

        // Return
        return {
            msg: 'Success'
        };

    } catch (err) {
        if(!err.statusCode)
            err.statusCode = 500;
        throw err;
    }
}

const customWithdrawAmtValidation = async(amt, { req }) => {
    // Check Min Withdraw Amount
    const getMinWd = await sequelize.query('SELECT min_withdraw FROM settings', {
        type: QueryTypes.SELECT,
    });
    let minWithdraw = getMinWd[0].min_withdraw;
    
    if(amt < minWithdraw) { 
        throw new Error(`Minumum Withdrawal Amount is ${minWithdraw}`);
    }

    // Check Max Withdraw Amount
    let userInfo = await User.findOne({ where: { id: req.userInfo.id }, attributes: ['pub_balance'] });

    let userBal = userInfo.dataValues.pub_balance;

    // Check
    if(userBal < amt) {
        throw new Error(`Insufficient Balance, Maximum withdrawal amount is ${userBal}`);
    }
}

const customDepositAmtValidation = async(amt, { req }) => {
    // Check Min Deposit Amount
    const getMinDeposit = await sequelize.query('SELECT min_deposit FROM settings', {
        type: QueryTypes.SELECT,
    });
    let minDeposit = getMinDeposit[0].min_deposit;
    
    if(amt < minDeposit) { 
        throw new Error(`Minumum Deposit Amount is ${minDeposit}`);
    }

    // Check Max Withdraw Amount
    let userInfo = await User.findOne({ where: { id: req.userInfo.id }, attributes: ['pub_balance'] });

    let userBal = userInfo.dataValues.pub_balance;

    // Check
    if(userBal < amt) {
        throw new Error(`Insufficient Balance, Maximum Conversion amount is ${userBal}`);
    }
}

const customProcessorValidation = async(processor) => {
    // Check if valid witndraw processor
    if(processor != 1 && processor != 2 && processor != 3) {
        throw new Error('Processor Doesn\'t Exist!');
    }
    return true;
}