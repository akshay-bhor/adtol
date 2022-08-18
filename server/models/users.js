// // const { DataTypes } = require('sequelize');
// // const sequelize = require('../utils/db');
// const mongoose = require('mongoose');
// const { Schema } = mongoose;
//
// const User = mongoose.model('users', new Schema({
//     user: {
//         type: String,
//         unique: true,
//         required: true
//     },
//     mail: {
//         type: String,
//         unique: true,
//         required: true
//     },
//     gid: {
//         type: String,
//         required: false,
//         index: true,
//         unique: true,
//         sparse: true
//     },
//     pass: {
//         type: String,
//         required: false
//     },
//     country: {
//         type: mongoose.Types.ObjectId,
//         ref: 'countries',
//         required: true
//     },
//     mobile: {
//         type: Number,
//         required: true,
//         index: true
//     },
//     name: {
//         type: String,
//     },
//     surname: {
//         type: String,
//     },
//     ac_type: {
//         type: Number,
//         required: true
//     },
//     ref_by: {
//         type: mongoose.Types.ObjectId,
//         ref: 'users',
//         required: false
//     },
//     company_name: {
//         type: String,
//         required: false,
//         default: 'NA'
//     },
//     pub_earnings: {
//         type: Number,
//         required: true,
//         default: 0
//     },
//     ref_earnings: {
//         type: Number,
//         required: true,
//         default: 0
//     },
//     ad_spending: {
//         type: Number,
//         required: true,
//         default: 0
//     },
//     ad_balance: {
//         type: Number,
//         required: true,
//         default: 0
//     },
//     pub_balance: {
//         type: Number,
//         required: true,
//         default: 0
//     },
//     pub_views: {
//         type: Number,
//         required: true,
//         default: 0
//     },
//     pub_clicks: {
//         type: Number,
//         required: true,
//         default: 0
//     },
//     pub_pops: {
//         type: Number,
//         required: true,
//         default: 0
//     },
//     ad_views: {
//         type: Number,
//         required: true,
//         default: 0
//     },
//     ad_clicks: {
//         type: Number,
//         required: true,
//         default: 0
//     },
//     ad_pops: {
//         type: Number,
//         required: true,
//         default: 0
//     },
//     status: { // 1 active 2 banned
//         type: Number,
//         default: 1
//     },
//     rank: {
//         type: Number,
//         default: 3
//     }
// }));
// // const User = sequelize.define('users', {
// //     id: {
// //         type: DataTypes.INTEGER,
// //         primaryKey: true,
// //         autoIncrement: true,
// //         allowNull: false
// //     },
//     // user: {
//     //     type: DataTypes.STRING(20),
//     //     unique: true,
//     //     allowNull: false
//     // },
//     // mail: {
//     //     type: DataTypes.STRING(50),
//     //     unique: true,
//     //     allowNull: false
//     // },
//     // gid: {
//     //     type: DataTypes.STRING(21),
//     //     allowNull: true,
//     //     unique:true
//     // },
//     // pass: {
//     //     type: DataTypes.STRING(60),
//     //     allowNull: true
//     // },
//     // country: {
//     //     type: DataTypes.INTEGER(3),
//     //     allowNull: false
//     // },
//     // mobile: {
//     //     type: DataTypes.BIGINT(12),
//     //     allowNull: false
//     // },
//     // name: {
//     //     type: DataTypes.STRING(20),
//     // },
//     // surname: {
//     //     type: DataTypes.STRING(20)
//     // },
//     // ac_type: {
//     //     type: DataTypes.TINYINT(1),
//     //     allowNull: false
//     // },
//     // ref_by: {
//     //     type: DataTypes.INTEGER,
//     //     allowNull: true
//     // },
//     // company_name: {
//     //     type: DataTypes.STRING(50),
//     //     allowNull: false,
//     //     defaultValue: 'NA'
//     // },
//     // pub_earnings: {
//     //     type: DataTypes.FLOAT(15, 5),
//     //     allowNull: false,
//     //     defaultValue: 0
//     // },
//     // ref_earnings: {
//     //     type: DataTypes.FLOAT(15, 5),
//     //     allowNull: false,
//     //     defaultValue: 0
//     // },
//     // ad_spending: {
//     //     type: DataTypes.FLOAT(15, 5),
//     //     allowNull: false,
//     //     defaultValue: 0
//     // },
//     // ad_balance: {
//     //     type: DataTypes.FLOAT(15, 5),
//     //     allowNull: false,
//     //     defaultValue: 0
//     // },
//     // pub_balance: {
//     //     type: DataTypes.FLOAT(15, 5),
//     //     allowNull: false,
//     //     defaultValue: 0
//     // },
//     // pub_views: {
//     //     type: DataTypes.BIGINT(15),
//     //     allowNull: false,
//     //     defaultValue: 0
//     // },
//     // pub_clicks: {
//     //     type: DataTypes.BIGINT(15),
//     //     allowNull: false,
//     //     defaultValue: 0
//     // },
//     // pub_pops: {
//     //     type: DataTypes.BIGINT(15),
//     //     allowNull: false,
//     //     defaultValue: 0
//     // },
//     // ad_views: {
//     //     type: DataTypes.BIGINT(15),
//     //     allowNull: false,
//     //     defaultValue: 0
//     // },
//     // ad_clicks: {
//     //     type: DataTypes.BIGINT(15),
//     //     allowNull: false,
//     //     defaultValue: 0
//     // },
//     // ad_pops: {
//     //     type: DataTypes.BIGINT(15),
//     //     allowNull: false,
//     //     defaultValue: 0
//     // },
//     // status: { // 1 active 2 banned
//     //     type: DataTypes.TINYINT(1),
//     //     defaultValue: 1
//     // },
//     // rank: {
//     //     type: DataTypes.TINYINT(1),
//     //     defaultValue: 3
//     // }
// // },
// // {
// //     timestamps: true,
// //     indexes: [
// //         {
// //             name: 'mobile',
// //             using: 'BTREE',
// //             fields: ['mobile']
// //         }
// //     ]
// // });
//
// module.exports = User;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    user: { type: String, required: true, unique: true},
    mail: { type: String, required: true, unique: true},
    gid: { type: String, default: null},
    pass: String,
    country: { type: Schema.Types.ObjectId, ref: 'Categories'},
    mobile: { type: Number, required: true},
    name: String,
    surname: String,
    ac_type: { type: Number, required: true},
    ref_by: {type: Schema.Types.ObjectId, ref: 'User'},
    company_name: { type: String, required: true, default: 'NA'},
    pub_earnings: { type: Number, required: true, default: 0},
    ref_earnings: { type: Number, required: true, default: 0},
    ad_spending: { type: Number, required: true, default: 0},
    ad_balance: { type: Number, required: true, default: 0},
    pub_balance: { type: Number, required: true, default: 0},
    pub_views: { type: Number, required: true, default: 0},
    pub_clicks: { type: Number, required: true, default: 0},
    pub_pops: { type: Number, required: true, default: 0},
    ad_views: { type: Number, required: true, default: 0},
    ad_clicks: { type: Number, required: true, default: 0},
    ad_pops: { type: Number, required: true, default: 0},
    status: { type: Number, default: 1},
    rank: { type: Number, default: 3},
    user_info: {
        paypal: String,
        bank: String,
        ac_no: Number,
        ifsc: String,
        branch: String,
        upi: String,
        payoneer: String,
        verify: String,
        verify_exp: Number
    }
}, {timestamps: true});


module.exports = mongoose.model('User', UserSchema);
