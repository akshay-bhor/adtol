const { DataTypes } = require('sequelize');

const sequelize = require('../utils/db');

const User = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    user: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: false
    },
    mail: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false
    },
    gid: {
        type: DataTypes.STRING(21),
        allowNull: true,
        unique:true
    },
    pass: {
        type: DataTypes.STRING(60),
        allowNull: true
    },
    country: {
        type: DataTypes.INTEGER(3),
        allowNull: false
    },
    mobile: {
        type: DataTypes.BIGINT(12),
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(20),
    },
    surname: {
        type: DataTypes.STRING(20)
    },
    ac_type: {
        type: DataTypes.TINYINT(1),
        allowNull: false
    },
    ref_by: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    company_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'NA'
    },
    pub_earnings: {
        type: DataTypes.FLOAT(15, 5),
        allowNull: false,
        defaultValue: 0
    },
    ref_earnings: {
        type: DataTypes.FLOAT(15, 5),
        allowNull: false,
        defaultValue: 0
    },
    ad_spending: {
        type: DataTypes.FLOAT(15, 5),
        allowNull: false,
        defaultValue: 0
    },
    ad_balance: {
        type: DataTypes.FLOAT(15, 5),
        allowNull: false,
        defaultValue: 0
    },
    pub_balance: {
        type: DataTypes.FLOAT(15, 5),
        allowNull: false,
        defaultValue: 0
    },
    pub_views: {
        type: DataTypes.BIGINT(15),
        allowNull: false,
        defaultValue: 0
    },
    pub_clicks: {
        type: DataTypes.BIGINT(15),
        allowNull: false,
        defaultValue: 0
    },
    pub_pops: {
        type: DataTypes.BIGINT(15),
        allowNull: false,
        defaultValue: 0
    },
    ad_views: {
        type: DataTypes.BIGINT(15),
        allowNull: false,
        defaultValue: 0
    },
    ad_clicks: {
        type: DataTypes.BIGINT(15),
        allowNull: false,
        defaultValue: 0
    },
    ad_pops: {
        type: DataTypes.BIGINT(15),
        allowNull: false,
        defaultValue: 0
    },
    status: { // 1 active 2 banned
        type: DataTypes.TINYINT(1),
        defaultValue: 1
    },
    rank: {
        type: DataTypes.TINYINT(1),
        defaultValue: 3
    }
}, 
{
    timestamps: true,
    indexes: [
        {
            name: 'mobile',
            using: 'BTREE',
            fields: ['mobile']
        }
    ]
});

module.exports = User;