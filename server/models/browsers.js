// // const sequelize = require('../utils/db');
// // const { DataTypes } = require('sequelize');
// const mongoose = require('mongoose');
// const { Schema } = mongoose
//
// const Browsers = mongoose.model('browsers', new Schema({
//     name: {
//         type: String,
//         required: true
//     }
// }))
// // const Browsers = sequelize.define('browsers', {
// //     id: {
// //         type: DataTypes.INTEGER,
// //         primaryKey: true,
// //         allowNull: false,
// //         autoIncrement: true
// //     },
// //     name: {
// //         type: DataTypes.STRING(20),
// //         allowNull: false
// //     }
// // });
//
// module.exports = Browsers;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BrowsersSchema = new Schema({
    name: { type: String, required: true}
});


module.exports = mongoose.model('Browsers', BrowsersSchema);
