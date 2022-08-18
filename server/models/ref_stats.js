// // const sequelize = require('../utils/db');
// // const { DataTypes } = require('sequelize');
// const mongoose = require('mongoose');
// const { Schema } = mongoose;
//
// const Ref_Stats = mongoose.model('ref_stats', new Schema({
//     ref_uid: {
//         type: mongoose.Types.ObjectId,
//         ref: 'users',
//         required: true,
//         index: true
//     },
//     earned: {
//         type: Number,
//         required: true,
//         default: 0
//     },
//     day_unix: {
//         type: Number,
//         required: true
//     }
// }));
// // const Ref_Stats = sequelize.define('ref_stats', {
// //     id: {
// //         type: DataTypes.INTEGER,
// //         primaryKey: true,
// //         autoIncrement: true,
// //         allowNull: false
// //     },
//     // ref_uid: {
//     //     type: DataTypes.INTEGER,
//     //     allowNull: false
//     // },
//     // earned: {
//     //     type: DataTypes.FLOAT(15, 5),
//     //     allowNull: false,
//     //     defaultValue: 0
//     // },
//     // day_unix: {
//     //     type: DataTypes.BIGINT(10),
//     //     allowNull: false
//     // }
// // },
// // {
// //     indexes: [
// //         {
// //             name: "ref_uid",
// //             using: "BTREE",
// //             fields: ['ref_uid']
// //         }
// //     ]
// // });
//
// module.exports = Ref_Stats;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Ref_StatsSchema = new Schema({
    ref_uid: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    earned: { type: Number, required: true, default: 0},
    day_unix: { type: Number, required: true, default: 0},
});

module.exports = mongoose.model('Ref_Stats', Ref_StatsSchema);
