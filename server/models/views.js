// const sequelize = require('../utils/db');
// const { DataTypes } = require('sequelize');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const Views = mongoose.model('views', new Schema({
    campaign_id: {
        type: mongoose.Types.ObjectId,
        ref: 'campaigns',
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
        ref: 'ads',
        required: true
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
    ad_type: {
        type: Number,
        required: true
    },
    campaign_type: {
        type: mongoose.Types.ObjectId,
        ref: 'campaign_types',
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
        ref: 'devices',
        required: true,
        default: 0
    },
    os: {
        type: mongoose.Types.ObjectId,
        ref: 'os',
        required: true,
        default: 0
    },
    browser: {
        type: mongoose.Types.ObjectId,
        ref: 'browsers',
        required: true,
        default: 0
    },
    country: {
        type: mongoose.Types.ObjectId,
        ref: 'countries',
        required: true,
        default: 0
    },
    language: {
        type: mongoose.Types.ObjectId,
        ref: 'languages',
        required: true,
        default: 0
    },
    adult: {
        type: Number,
        required: true,
        default: 0
    },
    ad_cpc: {
        type: Number,
        required: true
    },
    ip: {
        type: String,
        required: true,
        default: 0
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
    }
})
.index({ campaign_type: 1, category: 1, device: 1, os: 1, browser: 1, country: 1, language: 1, adult: 1, day_unix: 1 }));

// const Views = sequelize.define('views', {
//     id: {
//         type: DataTypes.BIGINT(15),
//         primaryKey: true,
//         autoIncrement: true,
//         allowNull: false
//     },
    // campaign_id: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false
    // },
    // ad_uid: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false
    // },
    // pub_uid: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false
    // },
    // ad_id: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false
    // },
    // site_id: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false
    // },
    // ad_url: {
    //     type: DataTypes.STRING(2000),
    //     allowNull: false
    // },
    // ad_url_tiny: {
    //     type: DataTypes.STRING(7),
    //     allowNull: false
    // },
    // pub_url: {
    //     type: DataTypes.STRING(2000),
    //     allowNull: false
    // },
    // pub_url_tiny: {
    //     type: DataTypes.STRING(7),
    //     allowNull: false
    // },
    // ad_type: {
    //     type: DataTypes.TINYINT(1),
    //     allowNull: false
    // },
    // campaign_type: {
    //     type: DataTypes.INTEGER(2),
    //     allowNull: false
    // },
    // category: {
    //     type: DataTypes.INTEGER(2),
    //     allowNull: false,
    //     defaultValue: 0
    // },
    // device: {
    //     type: DataTypes.INTEGER(1),
    //     allowNull: false,
    //     defaultValue: 0
    // },
    // os: {
    //     type: DataTypes.INTEGER(2),
    //     allowNull: false,
    //     defaultValue: 0
    // },
    // browser: {
    //     type: DataTypes.INTEGER(1),
    //     allowNull: false,
    //     defaultValue: 0
    // },
    // country: {
    //     type: DataTypes.INTEGER(3),
    //     allowNull: false,
    //     defaultValue: 0
    // },
    // language: {
    //     type: DataTypes.INTEGER(2),
    //     allowNull: false,
    //     defaultValue: 0
    // },
    // adult: {
    //     type: DataTypes.TINYINT(1),
    //     allowNull: false,
    //     defaultValue: 0
    // },
    // ad_cpc: {
    //     type: DataTypes.FLOAT(10, 5),
    //     allowNull: false
    // },
    // ip: {
    //     type: DataTypes.STRING(45),
    //     allowNull: false,
    //     defaultValue: 0
    // },
    // day_unix: {
    //     type: DataTypes.BIGINT(10),
    //     allowNull: false,
    //     defaultValue: 0
    // },
    // time_unix: {
    //     type: DataTypes.BIGINT(10),
    //     allowNull: false,
    //     defaultValue: 0
    // }
// }, {
//     indexes: [
//         {
//             name: 'estimation',
//             using: 'BTREE',
//             fields: ['campaign_type', 'category', 'device', 'os', 'browser', 'country', 'language', 'adult', 'day_unix']
//         }
//     ]
// });

module.exports = Views;
