// // const sequelize = require('../utils/db');
// // const { DataTypes } = require('sequelize');
// const mongoose = require('mongoose');
// const { Schema } = mongoose;
//
// const Os = mongoose.model('os', new Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     version: {
//         type: Number,
//         required: true,
//         default: 0
//     }
// }))
// // const Os = sequelize.define('os', {
// //     id: {
// //         type: DataTypes.INTEGER,
// //         primaryKey: true,
// //         autoIncrement: true,
// //         allowNull: false
// //     },
// //     name: {
// //         type: DataTypes.STRING(20),
// //         allowNull: false
// //     },
// //     version: {
// //         type: DataTypes.INTEGER,
// //         allowNull: false,
// //         defaultValue: 0
// //     }
// // });
//
// module.exports = Os;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OsSchema = new Schema({
    name: { type: String, required: true},
    version: { type: Number, required: true, default: 0}
});

module.exports = mongoose.model('Os', OsSchema);
