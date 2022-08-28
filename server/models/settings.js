// const { DataTypes } = require("sequelize");
// const sequelize = require("../utils/db");
const mongoose = require('mongoose');
const { Schema } = mongoose;

const Settings = mongoose.model('settings', new Schema({
    min_deposit: {
        type: Number,
        required: true,
        default: '1.00'
    },
    max_deposit: {
        type: Number,
        required: true,
        default: '5000'
    },
    min_withdraw: {
        type: Number,
        required: true,
        default: '10.00'
    },
    withdraw_fee: {
        type: Number,
        required: true,
        default: '0.00'
    },
    ref_commision: {
        type: Number,
        required: true,
        default: '0.1'
    }, 
    min_cpc: {
        type: Number,
        required: true,
        default: '0.02'
    },
    min_pop_cpc: {
        type: Number,
        required: true,
        default: '0.002'
    },
    min_budget: {
        type: Number,
        required: true,
        default: '1'
    },
    min_daily_budget: {
        type: Number,
        required: true,
        default: '1'
    }
}));
// const Settings = sequelize.define('settings', {
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//         allowNull: false
//     },
    // min_deposit: {
    //     type: DataTypes.FLOAT(10, 2),
    //     allowNull: false,
    //     defaultValue: '1.00'
    // },
    // max_deposit: {
    //     type: DataTypes.FLOAT(10, 2),
    //     allowNull: false,
    //     defaultValue: '5000'
    // },
    // min_withdraw: {
    //     type: DataTypes.FLOAT(10, 2),
    //     allowNull: false,
    //     defaultValue: '10.00'
    // },
    // withdraw_fee: {
    //     type: DataTypes.FLOAT(6, 2),
    //     allowNull: false,
    //     defaultValue: '0.00'
    // },
    // ref_commision: {
    //     type: DataTypes.FLOAT(4, 2),
    //     allowNull: false,
    //     defaultValue: '0.1'
    // }, 
    // min_cpc: {
    //     type: DataTypes.FLOAT(10, 5),
    //     allowNull: false,
    //     defaultValue: '0.02'
    // },
    // min_pop_cpc: {
    //     type: DataTypes.FLOAT(10, 5),
    //     allowNull: false,
    //     defaultValue: '0.002'
    // },
    // min_budget: {
    //     type: DataTypes.FLOAT(15, 5),
    //     allowNull: false,
    //     defaultValue: '1'
    // },
    // min_daily_budget: {
    //     type: DataTypes.FLOAT(15, 5),
    //     allowNull: false,
    //     defaultValue: '1'
    // }
// });

module.exports = Settings;