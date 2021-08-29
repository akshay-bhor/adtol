const crypto = require('crypto');
const base62 = require('base62/lib/ascii');
const sequelize = require('../utils/db');
const { QueryTypes } = require('sequelize');

exports.tinify = (str) => {

    /**
     * Return unique max 7 character string
     */

    const hash = crypto.createHash('sha1').update(str).digest('hex'); // hash 160 bit 40 char
    const slice = hash.substring(0, 10); // substr of hex 40 bits 10 char
    const number = parseInt(slice, 16); // hex -> no
    return base62.encode(number); // no -> 7 char base62 -> upto 3 trillion combinations
}

exports.createUniquePaymentId = (prefix) => {

    // Create random integer
    let randInt = new Date().getTime();
    
    // Create random Int between 10 and 99
    let rInt = crypto.randomInt(10, 99);

    // base62 to reduce length
    let tiny = base62.encode(`${randInt}${rInt}`);

    let payId = `${prefix}_${tiny}`;

    return payId;
}

exports.extractHostname = (url) => {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}

executeQueryAsync = async (query) => {
    return await sequelize.query(query, {
        type: QueryTypes.SELECT
    });
}

exports.executeAllQueries = async (queries) => {
    let promises = [];
    queries.forEach(data => {
        promises.push(executeQueryAsync(data.query));
    });

    return Promise.all(promises);
}