// const { DataTypes } = require('sequelize');
// const sequelize = require('../utils/db');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const User_Info = mongoose.model('user_info', new Schema({
    uid: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'users',
        unique: true
    },
    paypal: {
        type: String,
        required: false
    },
    bank: {
        type: String,
        required: false
    },
    ac_no: {
        type: Number,
        required: false
    },
    ifsc: {
        type: String,
        required: false
    },
    branch: {
        type: String,
        required: false
    },
    upi: {
        type: String,
        required: false
    },
    payoneer: {
        type: String,
        required: false
    },
    verify: {
        type: String,
        required: false,
        index: true
    },
    verify_exp: {
        type: Number,
        required: false
    }
}));

// const User_Info = sequelize.define('user_info', {
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//         allowNull: false
//     },
    // uid: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    //     unique: true
    // },
    // paypal: {
    //     type: DataTypes.STRING,
    //     allowNull: true
    // },
    // bank: {
    //     type: DataTypes.STRING,
    //     allowNull: true
    // },
    // ac_no: {
    //     type: DataTypes.BIGINT,
    //     allowNull: true
    // },
    // ifsc: {
    //     type: DataTypes.STRING,
    //     allowNull: true
    // },
    // branch: {
    //     type: DataTypes.STRING,
    //     allowNull: true
    // },
    // upi: {
    //     type: DataTypes.STRING,
    //     allowNull: true
    // },
    // payoneer: {
    //     type: DataTypes.STRING,
    //     allowNull: true
    // },
    // verify: {
    //     type: DataTypes.STRING(12),
    //     allowNull: true
    // },
    // verify_exp: {
    //     type: DataTypes.BIGINT(10),
    //     allowNull: true
    // }
// }, 
// {
//     timestamps: true,
//     indexes: [
//         {
//             name: 'verify',
//             using: 'BTREE',
//             fields: ['verify']
//         }
//     ]
// });

module.exports = User_Info
