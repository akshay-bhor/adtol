const { Op } = require("sequelize");
const Settings = require("../../../models/settings");

exports.getRatesLimitsHelper = async (req) => {
    if (!req.userInfo || req.userInfo.rank != 1) {
        const err = new Error("Not allowed!");
        err.statusCode = 401;
        throw err;
    }

    try {
        const settings = await Settings.findOne();

        return settings;

    } catch (err) {
        if(!err.statusCode)
            err.statusCode = 500;
        throw err;
    }
}

exports.postRatesLimitsHelper = async (req) => {
    if (!req.userInfo || req.userInfo.rank != 1) {
        const err = new Error("Not allowed!");
        err.statusCode = 401;
        throw err;
    }

    try {
        const min_deposit = req.body.min_deposit;
        const max_deposit = req.body.max_deposit;
        const min_withdraw = req.body.min_withdraw;
        const ref_commision = req.body.ref_commision;
        const withdraw_fee = req.body.withdraw_fee;
        const min_cpc = req.body.min_cpc;
        const min_pop_cpc = req.body.min_pop_cpc;
        const min_budget = req.body.min_budget;
        const min_daily_budget = req.body.min_daily_budget;

        await Settings.updateMany({}, {
            min_deposit,
            max_deposit,
            min_withdraw,
            withdraw_fee,
            ref_commision,
            min_cpc,
            min_pop_cpc,
            min_budget,
            min_daily_budget
        });

        return {
            msg: 'success'
        }

    } catch (err) {
        if(!err.statusCode)
            err.statusCode = 500;
        throw err;
    }
}
