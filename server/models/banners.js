// // const sequelize = require('../utils/db');
// // const { DataTypes } = require('sequelize');
// const mongoose = require('mongoose');
// const { Schema } = mongoose;
//
// const Banners = mongoose.model('banners', new Schema({
//     campaign_id: {
//         type: mongoose.Types.ObjectId,
//         ref: 'campaigns',
//         required: true,
//         index: true
//     },
//     banner_id: {
//         type: mongoose.Types.ObjectId,
//         ref: 'user_banners',
//         required: true
//     },
//     size: {
//         type: mongoose.Types.ObjectId,
//         ref: 'banner_sizes',
//         required: true,
//         index: true
//     },
//     src: {
//         type: String,
//         required: true
//     }
// }));
//
// // const Banners = sequelize.define('banners', {
//     // id: {
//     //     type: DataTypes.INTEGER,
//     //     primaryKey: true,
//     //     allowNull: false,
//     //     autoIncrement: true
//     // },
//     // campaign_id: {
//     //     type: DataTypes.INTEGER,
//     //     allowNull: false
//     // },
//     // banner_id: {
//     //     type: DataTypes.INTEGER,
//     //     allowNull: false
//     // },
//     // size: {
//     //     type: DataTypes.INTEGER(2),
//     //     allowNull: false
//     // },
//     // src: {
//     //     type: DataTypes.STRING(50),
//     //     allowNull: false
//     // }
// // }, {
// //     indexes: [
// //         {
// //             name: 'campaign_id',
// //             using: 'BTREE',
// //             fields: ['campaign_id']
// //         },
// //         {
// //             name: 'size',
// //             using: 'BTREE',
// //             fields: ['size']
// //         }
// //     ]
// // });
//
// module.exports = Banners;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BannersSchema = new Schema({
    campaign_id: { type: Schema.Types.ObjectId, ref: 'Campaigns', required: true},
    banner_id: { type: Number, required: true},//{ type: Schema.Types.ObjectId, ref: 'Banners_sizes'},
    size: { type: Number, required: true},
    src: { type: String, required: true}
});


module.exports = mongoose.model('Banners', BannersSchema);
