const sequelize = require('../utils/db');
const { DataTypes } = require('sequelize');

const Btns = sequelize.define('btns', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(20),
        allowNull: false
    }
});

module.exports = Btns;