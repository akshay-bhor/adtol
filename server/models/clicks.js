const sequelize = require('../utils/db');
const { DataTypes } = require('sequelize');

const Clicks = sequelize.define('clicks', {
    id: {
        type: DataTypes.BIGINT(14),
        primaryKey: true,
        autoIncrement: true,
        allowNull: true
    },
    campaign_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ad_uid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    pub_uid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ad_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    site_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ad_url: {
        type: DataTypes.STRING(2000),
        allowNull: false
    },
    ad_url_tiny: {
        type: DataTypes.STRING(7),
        allowNull: false
    },
    pub_url: {
        type: DataTypes.STRING(2000),
        allowNull: false
    },
    pub_url_tiny: {
        type: DataTypes.STRING(7),
        allowNull: false
    },
    ad_type: {
        type: DataTypes.TINYINT(1),
        allowNull: false
    },
    category: {
        type: DataTypes.INTEGER(2),
        allowNull: false,
        defaultValue: 0
    },
    device: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 0
    },
    os: {
        type: DataTypes.INTEGER(2),
        allowNull: false,
        defaultValue: 0
    },
    browser: {
        type: DataTypes.INTEGER(2),
        allowNull: false,
        defaultValue: 0
    },
    country: {
        type: DataTypes.INTEGER(3),
        allowNull: false,
        defaultValue: 0
    },
    language: {
        type: DataTypes.INTEGER(2),
        allowNull: false,
        defaultValue: 0
    },
    ip: {
        type: DataTypes.STRING(45),
        allowNull: false,
        defaultValue: 0
    },
    ip_tiny: {
        type: DataTypes.STRING(7),
        allowNull: false
    },
    ad_cpc: {
        type: DataTypes.FLOAT(10, 5),
        allowNull: false
    },
    pub_cpc: {
        type: DataTypes.FLOAT(10, 5),
        allowNull: false
    },
    day_unix: {
        type: DataTypes.BIGINT(10),
        allowNull: false,
        defaultValue: 0
    },
    time_unix: {
        type: DataTypes.BIGINT(10),
        allowNull: false,
        defaultValue: 0
    },
    valid: {
        type: DataTypes.TINYINT(1),
        allowNull:false,
        defaultValue: 1
    }
}, {
    indexes: [
        {
            name: 'iptiny',
            using: 'BTREE',
            fields: ['ip_tiny']
        },
        {
            name: 'day_unix',
            using: 'BTREE',
            fields: ['day_unix']
        },
        {
            name: 'ad_id',
            using: 'BTREE',
            fields: ['ad_id']
        }
    ]
});

module.exports = Clicks;