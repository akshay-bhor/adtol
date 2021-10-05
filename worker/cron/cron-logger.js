// const fs = require('fs/promises');
// const path = require('path');

const { sendAlertMail } = require("../common/util");

exports.cronLogWrite = async (msg) => {
    try {
        const timeStamp = new Date().toISOString();
        const data = `\n[${timeStamp}] ${msg}`;
        
        // const res = await fs.appendFile(__dirname + '\\cron.log', data, 'utf-8');
       console.log(data);
    } catch (err) {
        console.log(err);
        // Send email alert
        sendAlertMail('Cron Job Failed', err);
    }
}