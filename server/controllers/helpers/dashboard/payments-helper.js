const { check, validationResult } = require("express-validator");
const { razorPay } = require("../../../common/razorpay");
const { createUniquePaymentId } = require("../../../common/util");
const Payments = require('../../../models/payments');
const { createHmac } = require('crypto');
const { App_Settings } = require('../../../common/settings');
const sequelize = require("../../../utils/db");
const User = require("../../../models/users");
const { QueryTypes } = require("sequelize");
const { sendPaymentSuccessMail } = require("../../../common/sendMails");

exports.createOrderHelper = async (req) => {
    if(!req.userInfo) {
        const err = new Error('Not Allowed!');
        err.statusCode = 401;
        throw err;
    }

    await check('amt').exists().withMessage('Amount Not Specified!').trim().escape().isFloat().withMessage('Invalid Deposit Amount!')
    .custom(customMinDepositAmtValidation).run(req);

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

        // Fetch publisher country
        const udata = await User.findOne({ where: { id: userid }, attributes: ['country'] });

        // Get country
        const ccode = udata.dataValues.country;
        const country = App_Settings.countries[ccode][1];

        // Amount
        const amount = Math.floor(req.body.amt * 100);

        const currency = country == "India" ? 'INR': 'USD';
        const mtx = createUniquePaymentId('pay');

        // Create Order Object
        const orderObject = {
            amount: amount,
            currency: currency,
            receipt: mtx
        }
        
        // Create razorpay order
        const order = await razorPay.orders.create(orderObject);

        // Exchange Rate
        const inr_to_usd_exchange_rate = +(parseFloat(process.env.INR_TO_USD_EXCHANGE_RATE).toFixed(2));
        
        // Store order in db
        const rzr_order_id = order.id;
        const order_amount = (order.amount / 100);
        const order_currency = order.currency;
        const order_status = order.status;
        const processor = 1;
        const time_unix = order.created_at;
        const exchange_rate = currency === "INR" ? inr_to_usd_exchange_rate : 1;

        const store = await Payments.create({
            uid: userid,
            mtx,
            rzr_order_id,
            amount: order_amount,
            currency: order_currency,
            status: order_status,
            processor,
            time_unix,
            exchange_rate
        });

        // Return
        return {
            api_key_id: process.env.PAY_KEY_ID,
            amount,
            currency: order_currency,
            name: "Adtol.com",
            order_id: rzr_order_id
        };

    } catch (err) {
        if(!err.statusCode)
            err.statusCode = 500;
        throw err;
    }
}

exports.verifyPaymentHelper = async (req) => {
    if(!req.userInfo) {
        const err = new Error('Not Allowed!');
        err.statusCode = 401;
        throw err;
    }

    try {
        // Userid
        const userid = req.userInfo.id;

        // Request payment params
        const rzr_payment_id = req.body.razorpay_payment_id;
        const rzr_order_id = req.body.razorpay_order_id;
        const rzr_signature  = req.body.razorpay_signature;

        // Fetch Order from db
        const order = await Payments.findOne({ where: { rzr_order_id: rzr_order_id, uid: userid } });
        
        if(!order) {
            const err = new Error('Order Not Found!');
            err.statusCode = 404;
            throw err;
        }

        // Verify Signature
        const gen_signature = createHmac('sha256', process.env.PAY_KEY_SECRET).update(`${rzr_order_id}|${rzr_payment_id}`).digest('hex');
        if(gen_signature != rzr_signature) {
            const err = new Error('Payment Unsuccessfull, Hash Failed!');
            err.statusCode = 422;
            throw err;
        }

        // Capture Payment
        const payCapture = await capturePayment(rzr_payment_id, order.dataValues.amount, order.dataValues.currency);

        // Amount
        let amount = order.dataValues.amount;

        // Exchange Rate
        let exchange_rate = 1;

        // Exchange Rate
        const inr_to_usd_exchange_rate = +(parseFloat(process.env.INR_TO_USD_EXCHANGE_RATE).toFixed(2));

        // Convert to USD if INR
        if(order.dataValues.currency === "INR") {
            amount = +(parseFloat(amount / inr_to_usd_exchange_rate).toFixed(2));
            exchange_rate = inr_to_usd_exchange_rate;
        }

        // Transaction
        const ts = await sequelize.transaction();
        try {
            // Store in db
            const store = await Payments.update({
                rzr_payment_id,
                rzr_signature,
                exchange_rate,
                status: 'captured'
            }, {
                where: {
                    rzr_order_id: rzr_order_id,
                    uid: userid
                }
            }, { transaction: ts });
            // Deposit into user ad_balance
            const deposit = await sequelize.query('UPDATE users SET `ad_balance` = `ad_balance` + ? WHERE id = ?', {
                type: QueryTypes.UPDATE,
                replacements: [amount, userid],
                mapToModel: User,
                transaction: ts
            });

            await ts.commit();
        } catch (err) {
            await ts.rollback();
            throw new Error(err);
        }

        // Send Payment Success Mail
        sendPaymentSuccessMail(req.userInfo.mail, req.userInfo.user, amount, rzr_payment_id, 'Payment Gateway');

        // Return
        return {
            msg: 'success'
        };

    } catch (err) { 
        if(!err.statusCode)
            err.statusCode = 500;
        throw err;
    }
}

const capturePayment = async (id, amt, currency) => {
    amt = Math.floor(amt * 100);
    try {
        // Capture razorpay payment
        const capture = await razorPay.payments.capture(id, amt, currency);

        return true;
    } catch (err) {
        // throw new Error(err.response.data.error.description);
        throw new Error('Error verifying payment, if amount is deducted from your account it will be refunded within 5 to 7 days!');
    }
}

const customMinDepositAmtValidation = async(amt, { req }) => {
    // Check Min Deposit Amount
    const getMinDeposit = await sequelize.query('SELECT min_deposit FROM settings', {
        type: QueryTypes.SELECT,
    });
    let minDeposit = getMinDeposit[0].min_deposit;
    
    if(amt < minDeposit) { 
        throw new Error(`Minumum Deposit Amount is ${minDeposit}`);
    }
}