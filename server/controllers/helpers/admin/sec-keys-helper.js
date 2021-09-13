const { genKeyPair } = require("../../../common/genKeyPair");
const { genSecretKey } = require("../../../common/util");

exports.genSecKeysHelper = async (req) => {
    if (!req.userInfo || req.userInfo.rank != 1) {
        const err = new Error("Not allowed!");
        err.statusCode = 401;
        throw err;
    }

    try {
        if(req.query.type === 'keyPair') {
            return genKeyPair(false);
        }
        if(req.query.type === 'hash') {
            const key = genSecretKey('hmac', 96);
            return { key }
        }
        if(req.query.type === 'aes') {
            const key = genSecretKey('aes', 128);
            return { key }
        }

        return {}

    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        throw err;
    }
}