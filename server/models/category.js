const sequelize = require('../utils/db');
const { DataTypes } = require('sequelize');

const Categories = sequelize.define('categorie', {
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

module.exports = Categories;