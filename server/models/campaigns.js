const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const Campaigns = sequelize.define('campaigns', {
    id: { // Campaign Id
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    campaign_title: {
        type: DataTypes.STRING(60),
        allowNull: false
    },
    campaign_type: {
        type: DataTypes.INTEGER(2),
        allowNull: false,
        defaultValue: 0
    },
    uid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING(60),
        allowNull: false,
    },
    desc: {
        type: DataTypes.STRING(300),
        allowNull: false
    },
    url: {
        type: DataTypes.STRING(2000),
        allowNull: false
    },
    domain_hash: { // Domain hash to prevent same site ad
        type: DataTypes.STRING(12),
        allowNull: false
    },
    category: {
        type: DataTypes.STRING(140),
        allowNull: false,
        defaultValue: 0
    },
    country: {
        type: DataTypes.STRING(1000),
        allowNull: false,
        defaultValue: 0
    },
    device: {
        type: DataTypes.STRING(10),
        allowNull:false,
        defaultValue: 0
    },
    os: {
        type: DataTypes.STRING(240),
        allowNull: false,
        defaultValue: 0
    },
    browser: {
        type: DataTypes.STRING(60),
        allowNull: false,
        defaultValue: 0
    },
    language: {
        type: DataTypes.STRING(75),
        allowNull: false,
        defaultValue: 0
    },
    day: { // 1 to 7
        type: DataTypes.STRING(25),
        defaultValue: 0,
        allowNull: false
    },
    timezone: {
        type: DataTypes.STRING,
        defaultValue: 'Asia/Kolkata',
        allowNull: false
    },
    rel: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: 1
    },
    btn: {
        type: DataTypes.INTEGER(2),
        allowNull: false,
        defaultValue: 0
    },
    // banners: { // JSON { id: bannerid, size: 1 ... 8 } 
    //     type: DataTypes.STRING(500),
    //     allowNull: false,
    //     defaultValue: 0
    // },
    bot: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: 0
    },
    cpc: {
        type: DataTypes.FLOAT(10, 5),
        defaultValue: 0.02,
        allowNull:false
    },
    views: {
        type: DataTypes.BIGINT(15),
        defaultValue: 0,
        allowNull: false
    },
    clicks: {
        type: DataTypes.BIGINT(12),
        defaultValue: 0,
        allowNull: false
    },
    pops: {
        type: DataTypes.BIGINT(15),
        defaultValue: 0,
        allowNull: false
    },
    budget: {
        type: DataTypes.FLOAT(15, 5),
        allowNull: false
    },
    budget_rem: {
        type: DataTypes.FLOAT(15, 5),
        allowNull: false
    },
    today_budget: {
        type: DataTypes.FLOAT(15, 5),
        allowNull: false
    },
    today_budget_rem: {
        type: DataTypes.FLOAT(15, 5),
        allowNull: false
    },
    spent: {
        type: DataTypes.FLOAT(15, 5),
        allowNull: false
    },
    adult: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 0
    },
    run: { // 1 running 2 user pause 3 machine pause
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 1
    },
    status: { // 1 approved 2 pending 3 rejected 4 deleted
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 2
    },
    pro: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 0
    }
}, {
    indexes: [
        {
            name: 'domain_hash',
            using: 'BTREE',
            fields: ['domain_hash']
        },
        {
            name: 'today_budget_rem',
            using: 'BTREE',
            fields: ['today_budget_rem']
        },
        {
            name: 'uid',
            using: 'BTREE',
            fields: ['uid']
        }
    ]
});

module.exports = Campaigns;