// const sequelize = require('../utils/db');
// const { DataTypes } = require('sequelize');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const User_Banners = mongoose.model('user_banners', new Schema({
    uid: {
        type: mongoose.Types.ObjectId,
        required: true,
        index: true
    },
    size: {
        type: mongoose.Types.ObjectId,
        ref: 'banner_sizes',
        required: true
    },
    src: {
        type: String,
        required: true
    }
}));

// const User_Banners = sequelize.define('user_banners', {
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         allowNull: false,
//         autoIncrement: true
//     },
    // uid: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false
    // },
    // size: {
    //     type: DataTypes.INTEGER(2),
    //     allowNull: false
    // },
    // src: {
    //     type: DataTypes.STRING(50),
    //     allowNull: false
    // }
// }, {
//     indexes: [
//         {
//             name: 'uid',
//             using: 'BTREE',
//             fields: ['uid']
//         }
//     ]
// });

module.exports = User_Banners;

