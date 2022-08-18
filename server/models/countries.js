// // const sequelize = require('../utils/db');
// // const { DataTypes } = require('sequelize');
// const mongoose = require('mongoose');
// const { Schema } = mongoose;
//
// const Countries = mongoose.model('countries', new Schema({
//     dial_code: {
//         type: Number,
//         required: true
//     },
//     code: {
//         type: String,
//         required: true
//     },
//     name: {
//         type: String,
//         required: true
//     }
// }));
// // const Countries = sequelize.define('countries', {
// //     id: {
// //         type: DataTypes.INTEGER,
// //         primaryKey: true,
// //         allowNull: false,
// //         autoIncrement: true
// //     },
// //     dial_code: {
// //         type: DataTypes.INTEGER(5),
// //         allowNull: false
// //     },
// //     code: {
// //         type: DataTypes.STRING(2),
// //         allowNull: false
// //     },
// //     name: {
// //         type: DataTypes.STRING(80),
// //         allowNull: false
// //     }
// // });
//
// module.exports = Countries;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CountriesSchema = new Schema({
    dial_code: { type: Number, required: true},
    code: { type: String, required: true},
    name: { type: String, required: true}
});

module.exports = mongoose.model('Countries', CountriesSchema);
