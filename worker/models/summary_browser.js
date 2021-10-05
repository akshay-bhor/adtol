const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const Summary_Browser = sequelize.define('summary_browser', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    ad_uid: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    pub_uid: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    browser: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    campaign: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    website: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    views: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    clicks: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    pops: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    cost: {
        type: DataTypes.FLOAT(15, 5),
        allowNull: false,
        defaultValue: 0
    },
    day_unix: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
        defaultValue: 0
    }
}, {
    indexes: [
        {
            name: 'aduid_dayunix',
            using: 'BTREE',
            fields: ['ad_uid', 'day_unix']
        },
        {
            name: 'pubuid_dayunix',
            using: 'BTREE',
            fields: ['pub_uid', 'day_unix']
        },
        {
            name: 'website',
            using: 'BTREE',
            fields: ['website']
        },
        {
            name: 'campaign',
            using: 'BTREE',
            fields: ['campaign']
        },
        {
            name: 'browser',
            using: 'BTREE',
            fields: ['browser']
        }
    ]
});

module.exports = Summary_Browser;