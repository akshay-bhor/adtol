const jwt = require('jsonwebtoken');
const Token_Blacklist = require('../models/token_blacklist');
const fs = require('fs');

module.exports = async (req, res, next) => {
    // Get Public key
    // const PUB_KEY = fs.readFileSync(__dirname + '/../common/id_rsa_pub.pem', 'utf-8');
    const PUB_KEY = process.env.RSA_PUB_KEY;

    const authHeader = req.get('Authorization') || req.cookies['adminAuth'] || null;
    if(!authHeader) {
        return next();
    }
    const token = authHeader.split(' ')[1];
    
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, PUB_KEY, { algorithms: ['RS256'] });
    } catch (error) { console.log(error);
        error.statusCode = 401;
        return next(error);
    }
    
    if(!decodedToken) {
        const err = new Error('You have been logged Out!');
        err.statusCode = 401;
        return next(err);
    }
    // Check if blacklisted
    let check = await Token_Blacklist.findOne({ where: { tid: decodedToken.tid } })
    if(check) {
        const err = new Error('This session is no longer active, login again!');
        err.statusCode = 401;
        return next(err);
    }

    req.userInfo = decodedToken;

    next();
};