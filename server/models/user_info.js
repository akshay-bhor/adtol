const { DataTypes } = require('sequelize');

const sequelize = require('../utils/db');

const User_Info = sequelize.define('user_info', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    paypal: {
        type: DataTypes.STRING,
        allowNull: true
    },
    bank: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ac_no: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    ifsc: {
        type: DataTypes.STRING,
        allowNull: true
    },
    branch: {
        type: DataTypes.STRING,
        allowNull: true
    },
    upi: {
        type: DataTypes.STRING,
        allowNull: true
    },
    payoneer: {
        type: DataTypes.STRING,
        allowNull: true
    },
    verify: {
        type: DataTypes.STRING(12),
        allowNull: true
    },
    verify_exp: {
        type: DataTypes.BIGINT(12),
        allowNull: true
    }
}, 
{
    indexes: [
        {
            name: 'verify',
            using: 'BTREE',
            fields: ['verify']
        }
    ]
});

module.exports = User_Info
