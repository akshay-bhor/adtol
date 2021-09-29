// const fs = require('fs/promises');
const path = require('path');

exports.cronLogWrite = async (msg) => {
    try {
        const timeStamp = new Date().toISOString();
        const data = `\n[${timeStamp}] ${msg}`;
        
        // const res = await fs.appendFile(__dirname + '\\cron.log', data, 'utf-8');
       console.log(data);
    } catch (err) {
        console.log(err);
    }
}