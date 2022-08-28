// const { DataTypes } = require("sequelize");
// const sequelize = require("../utils/db");
const mongoose = require('mongoose');
const { Schema } = mongoose;

const Summary_Country = mongoose.model('summary_country', new Schema({
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
    country: {
        type: mongoose.Types.ObjectId,
        ref: 'countries',
        required: true,
        default: 0,
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
        type: Number,
        required: true,
        default: 0
    },
    clicks: {
        type: Number,
        required: true,
        default: 0
    },
    pops: {
        type: Number,
        required: true,
        default: 0
    },
    cost: {
        type: Number,
        required: true,
        default: 0
    },
    day_unix: {
        type: Number,
        required: true,
        default: 0
    }
}).index({ pub_uid: 1, day_unix: 1 }).index({ ad_uid: 1, day_unix: 1 }));

// const Summary_Country = sequelize.define('summary_country', {
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
    // country: {
    //     type: DataTypes.INTEGER(3),
    //     allowNull: false,
    //     defaultValue: 0
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
//             name: 'country',
//             using: 'BTREE',
//             fields: ['country']
//         }
//     ]
// });

module.exports = Summary_Country;