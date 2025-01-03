const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");


const Withdraw = sequelize.define('withdraws', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    uid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    mtx: {
        type: DataTypes.STRING(14),
        unique: true,
        allowNull: false
    },
    amount: {
        type: DataTypes.FLOAT(10, 2),
        allowNull: false
    },
    currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD'
    },
    processor: { // 1 bank 2 paypal 3 payoneer 4 admin => abuse
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 2
    },
    fee: {
        type: DataTypes.FLOAT(6, 2),
        allowNull: false,
        defaultValue: '0.00'
    },
    status: { // 1 approved 2 pending 3 rejected
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 2
    },
    time_unix: {
        type: DataTypes.BIGINT(10),
        allowNull: false
    }
}, {
    indexes: [
        {
            name: 'uid',
            using: 'BTREE',
            fields: ['uid']
        }
    ]
});

module.exports = Withdraw;