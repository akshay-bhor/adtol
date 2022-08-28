const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const Token_Blacklist = sequelize.define('token_blacklist', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    tid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    }
});

module.exports = Token_Blacklist;