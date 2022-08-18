const jwt = require('jsonwebtoken');
const Issued_Tokens = require('../models/issued_tokens');
const Token_Blacklist = require('../models/token_blacklist');
const { QueryTypes } = require('sequelize');
const sequelize = require('../utils/db');
const fs = require('fs');
const { default: mongoose } = require('mongoose');

module.exports = class Token {

    constructor() {

    }

    issueToken = async (payload, exp, store = 0) => {
        
        // Get private key
        // const PRIV_KEY = fs.readFileSync(__dirname + '/id_rsa_priv.pem', 'utf-8');
        const PRIV_KEY = process.env.RSA_PRIV_KEY;

        if(store == 1) {
            let storedId = await this.storeToken(payload.id, exp);
            if(storedId) {
                payload.tid = storedId;
            }
        }
        //Issue token
        const token = jwt.sign(payload, {key: PRIV_KEY, passphrase: process.env.AES_KEY}, {algorithm: 'RS256'}, {
            expiresIn: exp
        });
        return token
    }

    storeToken = async (id, exp) => {
        // Convert sec to ms to s
        let expTime = Math.floor((new Date().getTime() + (1000 * exp)) / 1000);
        let store = await Issued_Tokens.create({
            uid: id,
            exp: expTime
        });

        if(store) return store._id;
        else return false;
    }

    createAccessToken = async (cUser) => {
        // Get immutable data to create token
        const userInfo = {}
        userInfo.id = cUser._id;
        userInfo.user = cUser.user;
        userInfo.mail = cUser.mail;
        userInfo.status = cUser.status;
        userInfo.rank = cUser.rank;
        userInfo.role = 'access';

        //Expiration Time => 90 days
        let expTime = Math.floor(60 * 60 * 24 * 90);

        //Create token
        const token = await this.issueToken(userInfo, expTime, 1);
        return token;
    }

    addTokenBlacklist = async (uid) => {
        // Get issued tokens
        const list = [];
        // const tokens = await Issued_Tokens.findAll({
        //     where: {
        //         uid: uid,
        //         blacklisted: 0
        //     },
        //     order: [
        //         ['id','ASC']
        //     ]
        // });
        const tokens = await Issued_Tokens.find({ uid: uid, blacklisted: 0 }).sort({ '_id': 1 });
        tokens.forEach(data => {
            list.push({tid: data._id.toString()});
        });

        // if(all == 0) {
        //     // Remove last value as it is just issued
        //     const last = list.pop();
        //     const lastEle = last.tid; 

        //     // BlackList issued tokens except last
        //     // sequelize.query('UPDATE issued_tokens SET blacklisted = 1 WHERE uid = ? AND id != ?', {
        //     //     replacements: [uid, lastEle],
        //     //     type: QueryTypes.UPDATE,
        //     //     mapToModel: Issued_Tokens
        //     // });
        //     Issued_Tokens.updateMany({ '_id': { $ne: mongoose.Types.ObjectId(lastEle) }, uid: uid }, { blacklisted: 1 });
        // }  
        // if(all == 1) {
            // BlackList issued tokens
            // sequelize.query('UPDATE issued_tokens SET blacklisted = 1 WHERE uid = ?', {
            //     replacements: [uid],
            //     type: QueryTypes.UPDATE,
            //     mapToModel: Issued_Tokens
            // });
            await Issued_Tokens.updateMany({ uid: uid }, { blacklisted: 1 });
        // } 

        if(list.length >= 1) {
            // Bulk create blacklist tokens
            await Token_Blacklist.insertMany(list);
        }
    }
}
