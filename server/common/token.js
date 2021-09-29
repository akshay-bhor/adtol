const jwt = require('jsonwebtoken');
const Issued_Tokens = require('../models/issued_tokens');
const Token_Blacklist = require('../models/token_blacklist');
const { QueryTypes } = require('sequelize');
const sequelize = require('../utils/db');
const fs = require('fs');

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

        if(store) return store.dataValues.id;
        else return false;
    }

    createAccessToken = async (cUser) => {
        // Get immutable data to create token
        const userInfo = {}
        userInfo.id = cUser.dataValues.id;
        userInfo.user = cUser.dataValues.user;
        userInfo.mail = cUser.dataValues.mail;
        userInfo.status = cUser.dataValues.status;
        userInfo.rank = cUser.dataValues.rank;
        userInfo.role = 'access';

        //Expiration Time => 90 days
        let expTime = Math.floor(60 * 60 * 24 * 90);

        //Create token
        const token = await this.issueToken(userInfo, expTime, 1);
        return token;
    }

    addTokenBlacklist = async (uid, all = 0) => {
        // Get issued tokens
        const list = [];
        const tokens = await Issued_Tokens.findAll({
            where: {
                uid: uid,
                blacklisted: 0
            },
            order: [
                ['id','ASC']
            ]
        });
        tokens.forEach(data => {
            list.push({tid: data.dataValues.id});
        });

        if(all == 0) {
            // Remove last value as it is just issued
            const last = list.pop();
            const lastEle = last.tid; 

            // BlackList issued tokens except last
            sequelize.query('UPDATE issued_tokens SET blacklisted = 1 WHERE uid = ? AND id != ?', {
                replacements: [uid, lastEle],
                type: QueryTypes.UPDATE,
                mapToModel: Issued_Tokens
            });
        }  
        if(all == 1) {
            // BlackList issued tokens
            sequelize.query('UPDATE issued_tokens SET blacklisted = 1 WHERE uid = ?', {
                replacements: [uid],
                type: QueryTypes.UPDATE,
                mapToModel: Issued_Tokens
            });
        } 

        if(list.length >= 1) {
            // Bulk create blacklist tokens
            Token_Blacklist.bulkCreate(list);
        }
    }
}