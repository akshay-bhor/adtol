const sequelize = require('../utils/db');
const { DataTypes } = require('sequelize');

const Banner_Sizes = sequelize.define('banner_sizes', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    size: {
        type: DataTypes.STRING(20),
        allowNull: false
    }
});

module.exports = Banner_Sizes;