const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");


const Settings = sequelize.define('setting', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    min_deposit: {
        type: DataTypes.FLOAT(10, 2),
        allowNull: false,
        defaultValue: '1.00'
    },
    min_withdraw: {
        type: DataTypes.FLOAT(10, 2),
        allowNull: false,
        defaultValue: '10.00'
    },
    withdraw_fee: {
        type: DataTypes.FLOAT(6, 2),
        allowNull: false,
        defaultValue: '0.00'
    },
    ref_commision: {
        type: DataTypes.FLOAT(4, 2),
        allowNull: false,
        defaultValue: '0.1'
    }
});

module.exports = Settings;