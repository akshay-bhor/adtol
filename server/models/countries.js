const sequelize = require('../utils/db');
const { DataTypes } = require('sequelize');

const Countries = sequelize.define('countrie', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    dial_code: {
        type: DataTypes.INTEGER(5),
        allowNull: false
    },
    code: {
        type: DataTypes.STRING(2),
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(80),
        allowNull: false
    }
});

module.exports = Countries;