const sequelize = require('../utils/db');
const { DataType, DataTypes } = require('sequelize');

const Campaign_types = sequelize.define('campaign_types', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    icon: {
        type: DataTypes.STRING(30),
        allowNull: true
    }
});

module.exports = Campaign_types;