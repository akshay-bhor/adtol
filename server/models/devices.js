// const sequelize = require('../utils/db');
// const { DataTypes } = require('sequelize');
const mongoose = require('mongoose');
const { Schema } = mongoose

const Devices = mongoose.model('devices', new Schema({
    name: {
        type: String,
        required: true
    }
}))
// const Devices = sequelize.define('devices', {
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

module.exports = Devices;