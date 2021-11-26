const { App_Settings } = require('./settings');
const parser = require('ua-parser-js');
const { intersectionArr } = require('./util');

exports.secretory = (result, req) => {
    /**
     * Solve SECRETORY PROBLEM
     * limit => 10000 => if more than 10000 search only 37% if not 100% match then next best match 
     * change the limit depending on benchmark
     */
    const ad_count = +req.webInfo.ad_count || 1;
    const ad_match_keys = [];
    const ad_match_perc = [];
    const adPoolLength = result.length;

     // Calculate 37% if above 10000
     let threshold = Math.floor(0.37 * adPoolLength);

     for(let i = 0;i < adPoolLength;i++) {
         // Return if best ad is found first
         const matchPerc = matchAd(result[i], req);

         // Skip if 0
         if(matchPerc === 0) continue;

         if(matchPerc >= 99 && ad_count == 1) {
             ad_match_keys.push(i);
             ad_match_perc.push(matchPerc);
             // Process array 
             processArr(ad_match_keys, ad_match_perc, ad_count);
             break;
         }

         if(adPoolLength <= 10000) {
             // Search all and store the best
             ad_match_keys.push(i);
             ad_match_perc.push(matchPerc);

             // Process array 
             processArr(ad_match_keys, ad_match_perc, ad_count);
         } 
         else { 
             // Find the best candidate 
            ad_match_keys.push(i);
            ad_match_perc.push(matchPerc);

            // Process array 
            processArr(ad_match_keys, ad_match_perc, ad_count);

            // If found after threshold then stop
            if(i > threshold) break;
         }
     }

     return ad_match_keys;
}

const processArr = (keyArr, percArr, count) => {
    // Check count
    if(keyArr.length <= count) {
        return;
    }
    
    // Find min match perc index
    const minIndex = percArr.indexOf(Math.min(...percArr));

    // Remove min
    percArr.splice(minIndex, 1);
    keyArr.splice(minIndex, 1);

    return;
}

const matchAd = (resObj, req) => {

    let match_perc = 0;

    /**
     * Match DoFollow
     */
    const webRel = req.webInfo.web_rel != null ? +req.webInfo.web_rel : null; // webRel is null for old adcodes
    const adRel = resObj.rel != null ? +resObj.rel : null; // adRel is null for pop ads
    if(adRel !== null && webRel !== null) { 
        if(webRel !== 1 && adRel == 1) return 0;
    } 

    /**
     * Match Category
     *  */ 
    // Get categories for ad
    const adCats = resObj.category.split('|').map(d => +d); // Convert to int
    // Get website category
    const webCat = req.webInfo.ad_cat;
    // Get allowed category from adcode
    const allowedCats = req.webInfo.web_cat || null;

    /** 
     * Old Without Categories
     * -- Merge these two after some time --
     *  */
    if(!allowedCats) {
        if(adCats[0] == 0 || adCats.includes(webCat)) { 
            match_perc += 15;
        }
        else {
            match_perc += 0;
        }
    }
    else { /** New With Categories in AdCode */
        const webAllowedCats = allowedCats.split(',').map(v => +v);
        if(adCats[0] == 0 || 
            (adCats.includes(webCat) && webAllowedCats[0] == 0) || 
            (adCats.includes(webCat) && intersectionArr(webAllowedCats, adCats).length > 0)
          ) { 
            match_perc += 15;
        }
        else {
            match_perc += 0;
        }
    }
    
    /**
     * Match Country
     */

    // Find country code
    let cCode = req.cCode;

    // Match user country code to ads
    const adCountries = resObj.country.split('|').map(d => +d);
    if(adCountries[0] == 0 || adCountries.includes(cCode)) {
        match_perc += 15;
    }
    else {
        match_perc += 0;
    }

    /**
     * Match Device
     */

    // Find device code
    const dCode = req.dCode;

    // Match user device type to ads
    const adDevices = resObj.device.split('|').map(d => +d);
    if(adDevices[0] == 0 || adDevices.includes(dCode)) {
        match_perc += 15;
    }
    else {
        match_perc += 0;
    }

    /**
     * Match os
     */

    // Get user os and version
    const ua = parser(req.get('user-agent'));
    const usrOs = ua.os.name || 'unknown';
    const usrOsVer = ua.os.version?.split('.')[0] || 0;

    // Find os code
    let osCodeArr = [];
    Object.keys(App_Settings.os).forEach((key) => {
        if(App_Settings.os[key][0] == usrOs)
            osCodeArr.push(+key);
    });

    // AD os
    const adOs = resObj.os.split('|').map(d => +d);
    if(adOs[0] == 0) {
        match_perc += 15; // For os
        match_perc += 13; // For os version
    }
    else {
        let osMatched = false;
        for(let i = 0;i < adOs.length;i++) {
            let code = adOs[i];
            if(osCodeArr.includes(code)) {
                if(!osMatched) {
                    match_perc += 15;
                    osMatched = true;
                }
                if(+App_Settings.os[code][1] <= +usrOsVer) {
                    match_perc += 13;
                    break;
                }
            }
        }

        // if(osMatched) {
        //     // Match os version
        //     for(let i = 0;i < adOs.length;i++) {
        //         let code = adOs[i];
        //         if(+App_Settings.os[code][1] <= +usrOsVer) {
        //             match_perc += 13;
        //             break;
        //         }
        //     }
        // }

        match_perc += 0;
    }

    /**
     * Match Browser
     */

    // Get Browser Code
    const bCode = req.bCode;

    // Match user browser with ads
    const adBrowsers = resObj.browser.split('|').map(d => +d);
    if(adBrowsers[0] == 0 || adBrowsers.includes(bCode)) {
        match_perc += 15;
    }
    else {
        match_perc += 0;
    }

    /**
     * Match Language
     *  */ 
    // Get language for ad
    const adLang = resObj.language.split('|').map(d => +d); // Convert to int
    // Get website language
    const webLang = req.webInfo.ad_lang;
    if(adLang[0] == 0 || adLang.includes(webLang)) {
        match_perc += 12;
    }
    else {
        match_perc += 0;
    }

    return match_perc;
}