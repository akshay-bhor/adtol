const { App_Settings } = require('../common/settings');
const geoip = require('geoip-country');
const parser = require('ua-parser-js');
const { tinify } = require('../common/util');

module.exports = async (req, res, next) => {
    try {

        /**
         * Get user country device and other codes
         */

        // Get user device
        const ua = parser(req.get('user-agent'));
        const deviceType = ua.device.type || 'Desktop';
        
        // Find device code and add it to req
        const dCode = Object.keys(App_Settings.devices).find(key => App_Settings.devices[key].toLowerCase() == deviceType.toLowerCase()) || 0;
        req.dCode = +dCode;
        
        // Find user os
        const usrOs = ua.os.name || 'unknown';
        const usrOsVer = ua.os.version.split('.')[0] || 0;
        
        // Find os Code
        let oCode = 0;
        Object.keys(App_Settings.os).forEach(key => {
            if(App_Settings.os[key][0] == usrOs && App_Settings.os[key][1] == usrOsVer)
                oCode = key;
        });
        req.oCode = +oCode;
        
        // Get user browser
        const usrBrowser = ua.browser.name || 'Chromium';
        
        // Get Browser Code
        const bCode = Object.keys(App_Settings.browsers).find(key => App_Settings.browsers[key] == usrBrowser) || 0;
        req.bCode = +bCode;
        
        // Get user country
        const { country } = geoip.lookup(req.ip) || { country: 'OT' };
        
        // Find country code
        let cCode = Object.keys(App_Settings.countries).find(key => App_Settings.countries[key][0] == country) || 0;
        req.cCode = +cCode;
        
         // Construct a hash for matching
         const ad_type = +req.webInfo.ad_type;
         const adult = +req.webInfo.ad_adult;
         let str = `0|1|${ad_type}|${adult}|1`; 
         let match_hash = tinify(str);
         req.match_hash = match_hash;

        next();

    } catch (err) {
        if(!err.statusCode)
            err.statusCode = 500;
        next(err);
    }
}