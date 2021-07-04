const crypto = require('crypto');

const algorithm = 'aes-256-ctr';
const key = process.env.AES_KEY; // key length 32
const iv = crypto.randomBytes(8).toString('hex'); // Initialization vector length needs to be 16

exports.encryptAES = (data) => {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const cipherText = cipher.update(data, 'utf-8', 'hex') + cipher.final('hex');

    // Hash encrypted text to check integrity
    const hash = crypto.createHmac('sha256', process.env.HASH_SECRET).update(cipherText).digest('hex');
    
    return cipherText + '-' + iv + '-' + hash;
}

exports.decryptAES = (cipher) => {
    try {
        const data = cipher.split('-');

        // Verify integrity of cipher
        const genHash = crypto.createHmac('sha256', process.env.HASH_SECRET).update(data[0]).digest('hex');
        if(genHash !== data[2]) {
            throw new Error('Data Tampered!');
        }

        const decipher = crypto.createDecipheriv(algorithm, key, data[1]); 
        const decipherText = decipher.update(data[0], 'hex', 'utf-8') + decipher.final('utf-8');

        return decipherText;
    } catch (err) {
        return false;
    } 
}