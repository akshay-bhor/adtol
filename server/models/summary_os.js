// const { DataTypes } = require("sequelize");
// const sequelize = require("../utils/db");
const mongoose = require('mongoose');
const { Schema } = mongoose;

const Summary_Os = mongoose.model('summary_os', new Schema({
    ad_uid: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: false
    },
    pub_uid: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: false
    },
    os: {
        type: mongoose.Types.ObjectId,
        ref: 'os',
        required: true,
        index: true
    },
    campaign: {
        type: mongoose.Types.ObjectId,
        ref: 'campaigns',
        required: false,
        index: true
    },
    website: {
        type: mongoose.Types.ObjectId,
        ref: 'pub_sites',
        required: false,
        index: true
    },
    views: {
        type: DataTypes.INTEGER,
        required: true,
        default: 0
    },
    clicks: {
        type: DataTypes.INTEGER,
        required: true,
        default: 0
    },
    pops: {
        type: DataTypes.INTEGER,
        required: true,
        default: 0
    },
    cost: {
        type: DataTypes.FLOAT(15, 5),
        required: true,
        default: 0
    },
    day_unix: {
        type: DataTypes.INTEGER(10),
        required: true,
        default: 0
    }
}).index({ ad_uid: 1, day_unix: 1 }).index({ pub_uid: 1, day_unix: 1 }));

// const Summary_Os = sequelize.define('summary_os', {
//     id: {
//         type: DataTypes.BIGINT,
//         primaryKey: true,
//         autoIncrement: true,
//         allowNull: false
//     },
    // ad_uid: {
    //     type: DataTypes.INTEGER,
    //     allowNull: true
    // },
    // pub_uid: {
    //     type: DataTypes.INTEGER,
    //     allowNull: true
    // },
    // os: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false
    // },
    // campaign: {
    //     type: DataTypes.INTEGER,
    //     allowNull: true
    // },
    // website: {
    //     type: DataTypes.INTEGER,
    //     allowNull: true
    // },
    // views: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    //     defaultValue: 0
    // },
    // clicks: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    //     defaultValue: 0
    // },
    // pops: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    //     defaultValue: 0
    // },
    // cost: {
    //     type: DataTypes.FLOAT(15, 5),
    //     allowNull: false,
    //     defaultValue: 0
    // },
    // day_unix: {
    //     type: DataTypes.INTEGER(10),
    //     allowNull: false,
    //     defaultValue: 0
    // }
// }, {
//     indexes: [
//         {
//             name: 'aduid_dayunix',
//             using: 'BTREE',
//             fields: ['ad_uid', 'day_unix']
//         },
//         {
//             name: 'pubuid_dayunix',
//             using: 'BTREE',
//             fields: ['pub_uid', 'day_unix']
//         },
//         {
//             name: 'website',
//             using: 'BTREE',
//             fields: ['website']
//         },
//         {
//             name: 'campaign',
//             using: 'BTREE',
//             fields: ['campaign']
//         },
//         {
//             name: 'os',
//             using: 'BTREE',
//             fields: ['os']
//         }
//     ]
// });

module.exports = Summary_Os;