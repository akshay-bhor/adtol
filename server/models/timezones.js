// const sequelize = require('../utils/db');
// const { DataTypes } = require('sequelize');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const Timezones = mongoose.model('timezones', new Schema({
    zone: {
        type: String,
        required: true
    }
}));

// const Timezones = sequelize.define('timezones', {
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         allowNull: false,
//         autoIncrement: true
//     },
//     zone: {
//         type: DataTypes.STRING,
//         allowNull: false
//     }
// });

module.exports = Timezones;