const sequelize = require('../utils/db');
const { DataTypes } = require('sequelize');

const Categories = sequelize.define('categories', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(25),
        allowNull: false
    }
});

module.exports = Categories;