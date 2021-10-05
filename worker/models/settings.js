const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");


const Settings = sequelize.define('settings', {
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
    max_deposit: {
        type: DataTypes.FLOAT(10, 2),
        allowNull: false,
        defaultValue: '5000'
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
    }, 
    min_cpc: {
        type: DataTypes.FLOAT(10, 5),
        allowNull: false,
        defaultValue: '0.02'
    },
    min_pop_cpc: {
        type: DataTypes.FLOAT(10, 5),
        allowNull: false,
        defaultValue: '0.002'
    },
    min_budget: {
        type: DataTypes.FLOAT(15, 5),
        allowNull: false,
        defaultValue: '1'
    },
    min_daily_budget: {
        type: DataTypes.FLOAT(15, 5),
        allowNull: false,
        defaultValue: '1'
    }
});

module.exports = Settings;