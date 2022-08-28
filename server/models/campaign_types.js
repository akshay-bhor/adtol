const sequelize = require('../utils/db');
const { DataTypes } = require('sequelize');

const Campaign_types = sequelize.define('campaign_types', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    desc: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    fields: { // title, desc, banner, btn, follow
        type: DataTypes.STRING(100),
        allowNull: false
    },
    icon: {
        type: DataTypes.STRING(30),
        allowNull: true
    }
});

module.exports = Campaign_types;