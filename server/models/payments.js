// const { DataTypes } = require("sequelize");
// const sequelize = require("../utils/db");
const mongoose = require('mongoose');
const { Schema } = mongoose;

const Payments = mongoose.model('payments', new Schema({
    uid: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: true,
        index: true
    },
    mtx: { // receipt id in razorpay
        type: String,
        unique: true,
        required: true
    },
    rzr_order_id: {
        type: String,
        unique: true,
        required: false
    },
    rzr_payment_id: {
        type: String,
        unique: true,
        required: false
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true,
        defaultValue: 'USD'
    },
    status: { // captured // created // refunded
        type: String,
        required: true,
        defaultValue: 'created'
    },
    processor: { // 1 -> payment gateway, 2 -> publisher balance, 3 -> admin
        type: Number,
        required: true
    },
    time_unix: {
        type: Number,
        required: true
    },
    rzr_signature: { // SHA256
        type: String,
        required: false
    }
}))
// const Payments = sequelize.define('payments', {
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//         allowNull: false
//     },
    // uid: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false
    // },
    // mtx: { // receipt id in razorpay
    //     type: DataTypes.STRING(14),
    //     unique: true,
    //     allowNull: false
    // },
    // rzr_order_id: {
    //     type: DataTypes.STRING(25),
    //     unique: true,
    //     allowNull: true
    // },
    // rzr_payment_id: {
    //     type: DataTypes.STRING(25),
    //     unique: true,
    //     allowNull: true
    // },
    // amount: {
    //     type: DataTypes.FLOAT(10, 2),
    //     allowNull: false
    // },
    // currency: {
    //     type: DataTypes.STRING(3),
    //     allowNull: false,
    //     defaultValue: 'USD'
    // },
    // status: { // captured // created // refunded
    //     type: DataTypes.STRING(10),
    //     allowNull: false,
    //     defaultValue: 'created'
    // },
    // processor: { // 1 -> payment gateway, 2 -> publisher balance, 3 -> admin
    //     type: DataTypes.TINYINT(1),
    //     allowNull: false
    // },
    // time_unix: {
    //     type: DataTypes.BIGINT(10),
    //     allowNull: false
    // },
    // rzr_signature: { // SHA256
    //     type: DataTypes.STRING(64),
    //     allowNull: true
    // }
// }, {
//     indexes: [
//         {
//             name: 'uid',
//             using: 'BTREE',
//             fields: ['uid']
//         }
//     ]
// });

module.exports = Payments;

