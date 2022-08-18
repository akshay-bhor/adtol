// // const sequelize = require('../utils/db');
// // const { DataTypes } = require('sequelize');
// const mongoose = require('mongoose');
// const { Schema } = mongoose
//
// const Campaign_types = mongoose.model('campaign_types', new Schema({
//     name: {
//         type: String,
//         required: true,
//     },
//     desc: {
//         type: String,
//         required: false,
//     },
//     fields: { // title, desc, banner, btn, follow
//         type: String,
//         required: true,
//     },
//     icon: {
//         type: String,
//         required: false,
//     }
// }))
// // const Campaign_types = sequelize.define('campaign_types', {
//     // id: {
//     //     type: DataTypes.INTEGER,
//     //     primaryKey: true,
//     //     allowNull: false,
//     //     autoIncrement: true
//     // },
//     // name: {
//     //     type: DataTypes.STRING(30),
//     //     allowNull: false
//     // },
//     // desc: {
//     //     type: DataTypes.STRING(200),
//     //     allowNull: true
//     // },
//     // fields: { // title, desc, banner, btn, follow
//     //     type: DataTypes.STRING(100),
//     //     allowNull: false
//     // },
//     // icon: {
//     //     type: DataTypes.STRING(30),
//     //     allowNull: true
//     // }
// // });
//
// module.exports = Campaign_types;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Campaign_typesSchema = new Schema({
    name: { type: String, required: true},
    desc: String,
    fields: { type: String, required: true},
    icon: String
});


module.exports = mongoose.model('Campaign_types', Campaign_typesSchema);
