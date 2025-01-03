const crypto = require('crypto');
const base62 = require('base62/lib/ascii');
const sequelize = require('../utils/db');
const { QueryTypes } = require('sequelize');
const { EmailTransporter } = require('./emailTransporter');

exports.tinify = (str) => {

    /**
     * Return unique max 7 character string
     */

    const hash = crypto.createHash('sha1').update(str).digest('hex'); // hash 160 bit 40 char
    const slice = hash.substring(0, 10); // substr of hex 40 bits 10 char
    const number = parseInt(slice, 16); // hex -> no
    return base62.encode(number); // no -> 7 char base62 -> upto 3 trillion combinations
}

exports.genSecretKey = (type = 'hmac', length = 96) => {
    if(type === 'hmac') return crypto.generateKeySync('hmac', { length: length }).export().toString('hex');
    if(type === 'aes') return crypto.generateKeySync('aes', { length: 128 }).export().toString('hex');
    return;
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
    let hostname;
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

exports.extractURL = (url) => {
    let hosturl;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("//") > -1) {
        hosturl = url.split('//')[1];
    }
    else {
        hosturl = url;
    }
    
    //find & remove "?"
    hosturl = hosturl.split('?')[0];

    return hosturl;
}

executeQueryAsync = async (query) => {
    return sequelize.query(query, {
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

exports.sendAlertMail = async (sub, msg) => {
    EmailTransporter.sendMail({
        to: 'adtol.com@gmail.com,akbhor50@gmail.com,macraze007@gmail.com',
        from: 'support@adtol.com',
        subject: `IMPORTANT: ${sub}`,
        html: `${msg}`
    }).catch(e => { console.log(e); });
}

exports.sendBalanceExhaustedMail = async (to, user, campaign_name) => {
    EmailTransporter.sendMail({
        to: to,
        from: 'support@adtol.com',
        subject: `AdTol.com - Balance Exhausted`,
        html: `
            Dear <b>${user}</b>,<br><br>

            Your Budget for the Campaign, <b>${campaign_name}</b> has been <font color="red"><b>EXHAUSTED</b></font>!<br>
            <b><a href="https://adtol.com/dashboard/campaigns">Add Balance</a> to the campaign to keep Ads Running!</b><br>

            <br>
            Regards,<br>
            Admin,<br>
            Adtol.com
        `
    }).catch(e => { console.log(e); });
}