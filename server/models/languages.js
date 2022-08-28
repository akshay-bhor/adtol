// const sequelize = require('../utils/db');
// const { DataTypes } = require('sequelize');
const mongoose = require('mongoose');
const { Schema } = mongoose

const Languages = mongoose.model('languages', new Schema({
    name: {
        type: String,
        required: true
    }
}))
// const Languages = sequelize.define('languages', {
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         allowNull: false,
//         autoIncrement: true
//     },
//     name: {
//         type: DataTypes.STRING(20),
//         allowNull: false
//     }
// });

module.exports = Languages;