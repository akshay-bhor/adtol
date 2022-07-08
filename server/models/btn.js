// const sequelize = require('../utils/db');
// const { DataTypes } = require('sequelize');
const mongoose = require('mongoose');
const { Schema } = mongoose

const Btns = mongoose.model('btns', new Schema({
    name: {
        type: String,
        required: true
    }
}))
// const Btns = sequelize.define('btns', {
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

module.exports = Btns;