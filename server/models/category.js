// const sequelize = require('../utils/db');
// const { DataTypes } = require('sequelize');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const Categories = mongoose.model('categories', new Schema({
    name: {
        type: String,
        required: true
    }
}))
// const Categories = sequelize.define('categories', {
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         allowNull: false,
//         autoIncrement: true
//     },
//     name: {
//         type: DataTypes.STRING(25),
//         allowNull: false
//     }
// });

module.exports = Categories;
