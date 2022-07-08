// const sequelize = require('../utils/db');
// const { DataTypes } = require('sequelize');

const mongoose = require('mongoose');
const { Schema } = mongoose;

const Pops = mongoose.model('pops', new Schema({
    campaign_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    ad_uid: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: true
    },
    pub_uid: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: true
    },
    ad_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'ads',
        index: true
    },
    site_id: {
        type: mongoose.Types.ObjectId,
        ref: 'pub_sites',
        required: true
    },
    ad_url: {
        type: String,
        required: true
    },
    ad_url_tiny: {
        type: String,
        required: true
    },
    pub_url: {
        type: String,
        required: true
    },
    pub_url_tiny: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'categories',
        required: true,
        default: 0
    },
    device: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'devices',
        default: 0
    },
    os: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'os',
        default: 0
    },
    browser: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'browsers',
        default: 0
    },
    country: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'countries',
        default: 0
    },
    language: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'languages',
        default: 0
    },
    adult: {
        type: Number,
        required: true,
        default: 0
    },
    ip: {
        type: String,
        required: true,
        default: 0
    },
    ip_tiny: {
        type: String,
        required: true
    },
    ad_cpc: {
        type: Number,
        required: true
    },
    pub_cpc: {
        type: Number,
        required: true
    },
    day_unix: {
        type: Number,
        required: true,
        default: 0
    },
    time_unix: {
        type: Number,
        required: true,
        default: 0
    },
    valid: {
        type: Number,
        required: true,
        default: 1
    }
}).index({ category: 1, device: 1, os: 1, browser: 1, country: 1, language: 1, adult: 1 }).index({ day_unix: 1, ip_tiny: 1 }));

// const Pops = sequelize.define('pops', {
//     id: {
//         type: DataTypes.BIGINT(14),
//         primaryKey: true,
//         autoIncrement: true,
//         allowNull: true
//     },
//     campaign_id: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     },
//     ad_uid: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     },
//     pub_uid: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     },
//     ad_id: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     },
//     site_id: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     },
//     ad_url: {
//         type: DataTypes.STRING(2000),
//         allowNull: false
//     },
//     ad_url_tiny: {
//         type: DataTypes.STRING(7),
//         allowNull: false
//     },
//     pub_url: {
//         type: DataTypes.STRING(2000),
//         allowNull: false
//     },
//     pub_url_tiny: {
//         type: DataTypes.STRING(7),
//         allowNull: false
//     },
//     category: {
//         type: DataTypes.INTEGER(2),
//         allowNull: false,
//         defaultValue: 0
//     },
//     device: {
//         type: DataTypes.TINYINT(1),
//         allowNull: false,
//         defaultValue: 0
//     },
//     os: {
//         type: DataTypes.INTEGER(2),
//         allowNull: false,
//         defaultValue: 0
//     },
//     browser: {
//         type: DataTypes.INTEGER(2),
//         allowNull: false,
//         defaultValue: 0
//     },
//     country: {
//         type: DataTypes.INTEGER(3),
//         allowNull: false,
//         defaultValue: 0
//     },
//     language: {
//         type: DataTypes.INTEGER(2),
//         allowNull: false,
//         defaultValue: 0
//     },
//     adult: {
//         type: DataTypes.TINYINT(1),
//         allowNull: false,
//         defaultValue: 0
//     },
//     ip: {
//         type: DataTypes.STRING(45),
//         allowNull: false,
//         defaultValue: 0
//     },
//     ip_tiny: {
//         type: DataTypes.STRING(7),
//         allowNull: false
//     },
//     ad_cpc: {
//         type: DataTypes.FLOAT(10, 5),
//         allowNull: false
//     },
//     pub_cpc: {
//         type: DataTypes.FLOAT(10, 5),
//         allowNull: false
//     },
//     day_unix: {
//         type: DataTypes.BIGINT(10),
//         allowNull: false,
//         defaultValue: 0
//     },
//     time_unix: {
//         type: DataTypes.BIGINT(10),
//         allowNull: false,
//         defaultValue: 0
//     },
//     valid: {
//         type: DataTypes.TINYINT(1),
//         allowNull:false,
//         defaultValue: 1
//     }
// }, {
//     indexes: [
//         {
//             name: 'iptiny_dayunix',
//             using: 'BTREE',
//             fields: ['ip_tiny', 'day_unix']
//         },
//         {
//             name: 'ad_id',
//             using: 'BTREE',
//             fields: ['ad_id']
//         },
//         {
//             name: 'estimation',
//             using: 'BTREE',
//             fields: ['category', 'device', 'os', 'browser', 'country', 'language', 'adult', 'day_unix']
//         }
//     ]
// });

module.exports = Pops;