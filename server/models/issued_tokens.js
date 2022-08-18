// // const { DataTypes } = require('sequelize');
// // const sequelize = require('../utils/db');
// const mongoose = require('mongoose');
// const { Schema } = mongoose
//
// const Issued_Tokens = mongoose.model('issued_tokens', new Schema({
//     uid: {
//         type: mongoose.Types.ObjectId,
//         ref: 'users',
//         required: true
//     },
//     exp: {
//         type: Number,
//         required: true
//     },
//     blacklisted: {
//         type: Number,
//         required: true,
//         default: 0
//     }
// }))
// // const Issued_Tokens = sequelize.define('issued_tokens', {
// //     id: {
// //         type: DataTypes.INTEGER,
// //         primaryKey: true,
// //         autoIncrement: true,
// //         allowNull: false
// //     },
//     // uid: {
//     //     type: DataTypes.INTEGER,
//     //     allowNull: false
//     // },
//     // exp: {
//     //     type: DataTypes.BIGINT(10),
//     //     allowNull: false
//     // },
//     // blacklisted: {
//     //     type: DataTypes.INTEGER(1),
//     //     allowNull: false,
//     //     defaultValue: 0
//     // }
// // });
//
// module.exports = Issued_Tokens;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Issued_TokensSchema = new Schema({
    uid: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    exp: { type: Number, required: true},
    blacklisted: { type: Number, required: true, default: 0}
}, {timestamps: true});

module.exports = mongoose.model('Issued_Tokens', Issued_TokensSchema);
