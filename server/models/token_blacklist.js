// const { DataTypes } = require('sequelize');
// const sequelize = require('../utils/db');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const Token_Blacklist = mongoose.model('token_blacklist', new Schema({
    tid: {
        type: mongoose.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'issued_tokens'
    }
}));

// const Token_Blacklist = sequelize.define('token_blacklist', {
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//         allowNull: false
//     },
//     tid: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         unique: true
//     }
// });

module.exports = Token_Blacklist;

