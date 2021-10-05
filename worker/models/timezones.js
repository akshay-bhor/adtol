const sequelize = require('../utils/db');
const { DataTypes } = require('sequelize');

const Timezones = sequelize.define('timezones', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    zone: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Timezones;