const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const Issued_Tokens = sequelize.define('issued_tokens', {
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
    exp: {
        type: DataTypes.BIGINT(10),
        allowNull: false
    },
    blacklisted: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: 0
    }
});

module.exports = Issued_Tokens;