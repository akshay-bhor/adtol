// // const sequelize = require('../utils/db');
// // const { DataTypes } = require('sequelize');
// const mongoose = require('mongoose');
// const { Schema } = mongoose;
//
// const Pub_Sites = mongoose.model('pub_sites', new Schema({
//     uid: {
//         type: mongoose.Types.ObjectId,
//         ref: 'users',
//         required: true,
//         index: true
//     },
//     domain: {
//         type: String,
//         required: true
//     },
//     hash: {
//         type: String,
//         required: true,
//         index: true
//     },
//     category: {
//         type: mongoose.Types.ObjectId,
//         ref: 'categories',
//         required: true
//     },
//     language: {
//         type: mongoose.Types.ObjectId,
//         ref: 'languages',
//         required: true
//     },
//     traffic: {
//         type: Number,
//         required: true
//     },
//     adult: {
//         type: Number,
//         required: true,
//         default: 0
//     },
//     views: {
//         type: Number,
//         required: true,
//         default: 0
//     },
//     clicks: {
//         type: Number,
//         required: true,
//         default: 0
//     },
//     pops: {
//         type: Number,
//         required: true,
//         default: 0
//     },
//     earned: {
//         type: Number,
//         required: true,
//         default: 0
//     },
//     status: { // 1 Approved 2 pending 3 rejected 4 deleted
//         type: Number,
//         required: true,
//         default: 2
//     }
// }));
// // const Pub_Sites = sequelize.define('pub_sites', {
// //     id: {
// //         type: DataTypes.INTEGER,
// //         primaryKey: true,
// //         allowNull: false,
// //         autoIncrement: true
// //     },
//     // uid: {
//     //     type: DataTypes.INTEGER,
//     //     allowNull: false
//     // },
//     // domain: {
//     //     type: DataTypes.STRING(100),
//     //     allowNull: false
//     // },
//     // hash: {
//     //     type: DataTypes.STRING(12),
//     //     allowNull: false
//     // },
//     // category: {
//     //     type: DataTypes.INTEGER(1),
//     //     allowNull: false
//     // },
//     // language: {
//     //     type: DataTypes.INTEGER(2),
//     //     allowNull: false
//     // },
//     // traffic: {
//     //     type: DataTypes.INTEGER,
//     //     allowNull: false
//     // },
//     // adult: {
//     //     type: DataTypes.INTEGER(1),
//     //     allowNull: false,
//     //     defaultValue: 0
//     // },
//     // views: {
//     //     type: DataTypes.BIGINT(12),
//     //     allowNull: false,
//     //     defaultValue: 0
//     // },
//     // clicks: {
//     //     type: DataTypes.BIGINT(12),
//     //     allowNull: false,
//     //     defaultValue: 0
//     // },
//     // pops: {
//     //     type: DataTypes.BIGINT(12),
//     //     allowNull: false,
//     //     defaultValue: 0
//     // },
//     // earned: {
//     //     type: DataTypes.FLOAT(15, 5),
//     //     allowNull: false,
//     //     defaultValue: 0
//     // },
//     // status: { // 1 Approved 2 pending 3 rejected 4 deleted
//     //     type: DataTypes.TINYINT(1),
//     //     allowNull: false,
//     //     defaultValue: 2
//     // }
// // }, {
// //     indexes: [
// //         {
// //             name: 'uid',
// //             using: 'BTREE',
// //             fields: ['uid']
// //         },
// //         {
// //             name: 'domain_hash',
// //             using: 'BTREE',
// //             fields: ['hash']
// //         }
// //     ]
// // });
//
// module.exports = Pub_Sites;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Pub_SitesSchema = new Schema({
    uid: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    domain: { type: String, required: true},
    hash: { type: String, required: true },
    category: {type: Schema.Types.ObjectId, ref: 'Categories', required: true},
    language: {type: Schema.Types.ObjectId, ref: 'Languages', required: true},
    traffic: {  type: Number, required: true},
    adult: { type: Number, required: true, default: 0},
    views: { type: Number, required: true, default: 0},
    pops: { type: Number, required: true, default: 0},
    earned: { type: Number, required: true, default: 0},
    status: { type: Number, required: true, default: 2}
});

module.exports = mongoose.model('Pub_Sites', Pub_SitesSchema);
