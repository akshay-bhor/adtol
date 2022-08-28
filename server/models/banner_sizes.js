// const sequelize = require('../utils/db');
// const { DataTypes } = require('sequelize');
const mongoose = require('mongoose');
const { Schema } = mongoose

const Banner_Sizes = mongoose.model('banner_sizes', new Schema({
    size: {
        type: String,
        required: true
    }
}));

// const Banner_Sizes = sequelize.define('banner_sizes', {
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         allowNull: false,
//         autoIncrement: true
//     },
//     size: {
//         type: DataTypes.STRING(20),
//         allowNull: false
//     }
// });

module.exports = Banner_Sizes;