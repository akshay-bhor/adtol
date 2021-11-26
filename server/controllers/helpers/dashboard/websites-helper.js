const { check, validationResult } = require("express-validator");
const { App_Settings } = require("../../../common/settings");
const Pub_Sites = require("../../../models/publisher_sites");
const psl = require('psl');
const { tinify, extractHostname } = require("../../../common/util");
const Banner_Sizes = require("../../../models/banner_sizes");
const { encryptAES } = require("../../../common/encrypt");
const crypto = require('crypto');
const { Op } = require("sequelize");
const { sendWebsitePendingMail, sendWebsiteApprovedMail } = require("../../../common/sendMails");


exports.websitesHelper = async (req) => {
    if(!req.userInfo) {
        const err = new Error('Not Allowed!');
        err.statusCode = 401;
        throw err;
    }

    try {
        
        // Userid
        const userid = req.userInfo.id;

        let sites = await Pub_Sites.findAll({ where: { uid: userid, [Op.not]: [{ status: 4 }] } });

        let sitesData = [];
        sites.forEach(data => {
            let tmp = {};

            tmp.id = data.dataValues.id;
            tmp.domain = data.dataValues.domain;
            tmp.adult = data.dataValues.adult;
            if(data.dataValues.status == 1)
                tmp.status = 'Active';
            if(data.dataValues.status == 2)
                tmp.status = 'Pending';
            if(data.dataValues.status == 3)
                tmp.status = 'Rejected';
            tmp.views = +data.dataValues.views;
            tmp.clicks = +data.dataValues.clicks;
            tmp.pops = +data.dataValues.pops;
            tmp.earned = parseFloat(data.dataValues.earned).toFixed(2);
            tmp.category = App_Settings.categories[data.dataValues.category] || 'Unknown';
            tmp.language = App_Settings.languages[data.dataValues.language] || 'English';
            tmp.ctr = Math.floor((tmp.clicks / tmp.views) * 10000) / 100;
            tmp.traffic = data.dataValues.traffic;

            sitesData.push({...tmp});
        });

        // Return
        return {
            data: sitesData
        };

    } catch (err) {
        if(!err.statusCode)
            err.statusCode = 500;
        throw err;
    }
}

exports.addWebsiteHelper = async (req) => {
    if(!req.userInfo) {
        const err = new Error('Not Allowed!');
        err.statusCode = 401;
        throw err;
    }

    /**
     *  using npm psl -> is a JavaScript domain name parser based on the Public Suffix List.
     */

    await check('domain').exists().withMessage('Domain not posted!').trim()
    .custom(val => psl.isValid(extractHostname(val))).withMessage('Invalid Domain!').run(req); // Post without http or https
    await check('category').exists().withMessage('Please select a category!').trim().isString().withMessage('Invalid Category!').run(req);
    await check('language').exists().withMessage('Please select website\'s language!').trim().isString().withMessage('Invalid Language!').run(req);
    await check('traffic').exists().trim().isInt().withMessage('Invalid traffic value!').escape().toInt().run(req);

    try {

        // Check validation errors
        const errs = validationResult(req);
        if(!errs.isEmpty()) {
            const err = new Error('Validation Failed!');
            err.statusCode = 422;
            err.data = errs.array();
            throw err;
        }

        // Validate adult
        let adult = 0;

        // Userid
        const userid = req.userInfo.id;

        // Domain
        const parse = psl.parse(extractHostname(req.body.domain));
        const domain = parse.domain;

        // Domain hash
        const dHash = tinify(domain);

        // Traffic
        const traffic = req.body.traffic;

        // Verify categories
        const catId = Object.keys(App_Settings.categories).filter(key => {
            let cat = App_Settings.categories[key];
            if(cat == req.body.category) return true;
        })[0];

        // Verify languages
        const langId = Object.keys(App_Settings.languages).filter(key => {
            let lang = App_Settings.languages[key];
            if(lang == req.body.language) return true;
        })[0];

        // Verify category and language
        if(catId == null || catId == undefined) {
            const err = new Error('Category not found!');
            err.statusCode = 422;
            throw err;
        }
        if(langId == null || langId == undefined) {
            const err = new Error('Language not found!');
            err.statusCode = 422;
            throw err;
        }

        // Validate adult
        if(req.body.category == 'Adult') adult = 1; 

        // Check if domain already exist for that user
        const exist = await Pub_Sites.findOne({ where: { hash: dHash, uid: userid } });
        if(exist) {
            const err = new Error('Domain already exist!');
            err.statusCode = 422;
            throw err;
        }

        // set default status to approved
        const status = 1;

        // Insert
        const insert = await Pub_Sites.create({
            uid: userid,
            domain: domain,
            hash: dHash,
            category: catId,
            language: langId,
            traffic: traffic,
            adult: adult,
            status: status
        });
        
        // Send Mail
        // sendWebsitePendingMail(req.userInfo.mail, req.userInfo.user, domain);
        sendWebsiteApprovedMail(req.userInfo.mail, req.userInfo.user, domain);

        // Return
        return {
            msg: 'success',
            id: insert.dataValues.id
        };

    } catch(err) {
        if(!err.statusCode)
            err.statusCode = 500;
        throw err;
    }
}

exports.editWebsiteHelper = async (req) => {
    if(!req.userInfo) {
        const err = new Error('Not Allowed!');
        err.statusCode = 401;
        throw err;
    }

    await check('webid').exists().trim().isInt().withMessage('Invalid website ID!').run(req);
    await check('domain').exists().withMessage('Domain not posted!').trim()
    .custom(val => psl.isValid(extractHostname(val))).withMessage('Invalid Domain!').run(req);
    await check('category').exists().withMessage('Please select a category!').trim().isString().withMessage('Invalid Category!').run(req);
    await check('language').exists().withMessage('Please select website\'s language!').trim().isString().withMessage('Invalid Language!').run(req);
    await check('traffic').exists().trim().isInt().withMessage('Invalid traffic value!').escape().toInt().run(req);

    try {

        // Check validation errors
        const errs = validationResult(req);
        if(!errs.isEmpty()) {
            const err = new Error('Validation Failed!');
            err.statusCode = 422;
            err.data = errs.array();
            throw err;
        }

        // Validate adult
        let adult = 0;

        // Userid
        const userid = req.userInfo.id;

        // Domain
        const parse = psl.parse(extractHostname(req.body.domain));
        const domain = parse.domain;

        // Domain hash
        const dHash = tinify(domain);

        // Traffic
        const traffic = req.body.traffic;

        // Website ID
        const website_id = req.params.webid;
        
        // Verify categories
        const catId = Object.keys(App_Settings.categories).filter(key => {
            let cat = App_Settings.categories[key];
            if(cat == req.body.category) return true;
        })[0];
        
        // Verify languages
        const langId = Object.keys(App_Settings.languages).filter(key => {
            let lang = App_Settings.languages[key];
            if(lang == req.body.language) return true;
        })[0];

        // Verify category and language
        if(catId == null || catId == undefined) {
            const err = new Error('Category not found!');
            err.statusCode = 422;
            throw err;
        }
        if(langId == null || langId == undefined) {
            const err = new Error('Language not found!');
            err.statusCode = 422;
            throw err;
        }

        const getWebInfo = await Pub_Sites.findOne({ 
            where: {
                id: website_id,
                uid: userid
            }
        });
        
        // Check what values updated
        let status = getWebInfo.dataValues.status;
        const oldHash = getWebInfo.dataValues.hash;
        const oldCat = getWebInfo.dataValues.category;
        const oldLang = getWebInfo.dataValues.language;
        if(oldHash != dHash || oldCat != catId || oldLang != langId) {
            status = 2;
        }

        // Validate adult
        if(req.body.category == "Adult") adult = 1; 

        // Update
        const update = await Pub_Sites.update({
            domain: domain,
            hash: dHash,
            category: catId,
            language: langId,
            traffic: traffic,
            adult: adult,
            status: status
        }, {
            where: {
                id: website_id,
                uid: userid
            }
        });
        
        if(update[0] == 0) {
            const err = new Error('Something Went Wrong, try again!');
            err.statusCode = 422;
            throw err;
        }

        // Return
        return {
            msg: 'success'
        };

    } catch(err) {
        if(!err.statusCode)
            err.statusCode = 500;
        throw err;
    }
}

exports.deleteWebsiteHelper = async (req) => {
    if(!req.userInfo) {
        const err = new Error('Not Allowed!');
        err.statusCode = 422;
        throw err;
    }

    await check('webid').exists().trim().isInt().withMessage('Invalid website ID!').run(req);

    try {

        // Check validation errors
        const errs = validationResult(req);
        if(!errs.isEmpty()) {
            const err = new Error('Validation Failed!');
            err.statusCode = 422;
            err.data = errs.array();
            throw err;
        }
        
        // Userid
        const userid = req.userInfo.id;

        // Website ID
        const website_id = req.params.webid;

        // Status
        const status = 4;

        // Update
        const update = await Pub_Sites.update({
            status: status
        }, {
            where: {
                id: website_id,
                uid: userid
            }
        });
        
        if(update[0] == 0) {
            const err = new Error('Something Went Wrong, try again!');
            err.statusCode = 422;
            throw err;
        }

        // Return
        return {
            msg: 'success'
        };

    } catch(err) {
        if(!err.statusCode)
            err.statusCode = 500;
        throw err;
    }
}

exports.getAdcodeHelper = async (req) => {
    if(!req.userInfo) {
        const err = new Error('Not Allowed!');
        err.statusCode = 401;
        throw err;
    }

    await check('webid').exists().withMessage('Please select a website!').trim().escape().isInt().withMessage('Invalid Website ID!').run(req);
    // Count for widget ad
    await check('count').trim().escape().isInt().withMessage('Count should be between 3 and 12!').run(req);
    if(req.body.rel) await check('rel').exists().trim().escape().isInt().notEmpty().withMessage('Invalid Follow').custom(val => {
        if(+val !== 0 && +val !== 1 && +val !== 2) throw new Error('Invalid value for Follow');
        else return true;
    }).run(req);
    await check('category').exists().trim().escape().isString().notEmpty().withMessage('Category is required').custom(categoryValidation).run(req);

    try {
        // Check user input errors
        const errs = validationResult(req);
        if(!errs.isEmpty() || (req.body.adult != 0 && req.body.adult != 1)) {
            const err = new Error('Validation Failed!');
            err.statusCode = 422;
            err.data = errs.array();

            // Check for adult
            if(req.body.adult !== true && req.body.adult !== false) {
                // Get index to set
                const iLen = err.data.length;
                err.data[iLen] = {
                    "msg": "Please choose to weather to allow adult or not!",
                    "param": "adult",
                    "location": "body"
                }
            }

            throw err;
        }

        // Check if count valid
        const adCount = req.body.count || 1;
        if(adCount < 3 || adCount > 12) {
            throw new Error('Invalid Ad Count!');
        }

        // Userid
        const userid = req.userInfo.id;

        // Get user input
        const webid = req.body.webid;
        let adult = req.body.adult ? 1:0;
        const webCats = req.body.category;
        const webRel = req.body.rel !== null ? req.body.rel:null;
        
        // Script extension based on env
        let scriptEXT = 'js';
        if(process.env.NODE_ENV === 'development') scriptEXT = 'dev.js';

        // Check ownershipt and get data
        const webInfo = await Pub_Sites.findOne({ where: { uid: userid, id: webid }, attributes: ['hash', 'category', 'language', 'adult', 'status'] });
        
        if(!webInfo) {
            const err = new Error('Not Allowed!');
            err.statusCode = 401;
            throw err;
        }

        // Check if website approved
        // if(webInfo.dataValues.status != 1) {
        //     throw new Error('Website has not been approved yet!');
        // }

        // Get banner info
        const bInfo = await Banner_Sizes.findAll();
        if(bInfo.length == 0) {
            throw new Error('No banner sizes available! Contact Admin.');
        }

        // WebInfo object
        let webInfoObj = {};
        // Check if website is adult
        if(webInfo.dataValues.adult == 1) adult = 1;
        webInfoObj.ad_adult = adult;
        webInfoObj.web_id = webid;
        webInfoObj.ad_hash = webInfo.dataValues.hash;
        webInfoObj.ad_lang = webInfo.dataValues.language;
        webInfoObj.ad_cat = webInfo.dataValues.category;
        webInfoObj.web_cat = webCats;
        if(webRel !== null) webInfoObj.web_rel = webRel;
        webInfoObj.ad_count = 1;
        webInfoObj.type = 'adcode';

        // Create Ad Codes for banners
        let code = '';
        let bannerAdCodes = [];
        bInfo.forEach(b => {
            
            // WebInfo object
            webInfoObj.ad_type = 2;
            webInfoObj.ad_banner_size = b.id;

            // Create random id
            let randId = crypto.randomBytes(3).toString('hex');
            
            // Create ad code
            code = encryptAES(JSON.stringify(webInfoObj));
            bannerAdCodes[b.size] = `<script type="text/javascript">
                var adtol_ad_client_${randId} = '${code}';
            </script>
            <script id="${randId}" type="text/javascript" src="${process.env.ORIGIN}/js/banner.${scriptEXT}" async defer></script>`;
        });
        bannerAdCodes = {...bannerAdCodes};

        // Create Ad Code for text ad
        webInfoObj.ad_type = 1;
        webInfoObj.ad_banner_size = 0;
        // Create random id
        let randId = crypto.randomBytes(3).toString('hex');
        code = encryptAES(JSON.stringify(webInfoObj));
        const textAdCode = `<script type="text/javascript">
            var adtol_ad_client_${randId} = '${code}';
        </script>
        <script id="${randId}" type="text/javascript" src="${process.env.ORIGIN}/js/text.${scriptEXT}" async defer></script>`;

        // Create Ad Code for native ad
        webInfoObj.ad_type = 3;
        let native_ad_codes = [];
        let bInfoObj = bInfo.find(d => d.dataValues.size == '336x280'); 
        native_ad_codes.push(bInfoObj.dataValues.id);
        bInfoObj = bInfo.find(d => d.dataValues.size == '300x150'); 
        native_ad_codes.push(bInfoObj.dataValues.id);
        bInfoObj = bInfo.find(d => d.dataValues.size == '300x250'); 
        native_ad_codes.push(bInfoObj.dataValues.id);
        webInfoObj.ad_banner_size = native_ad_codes;
        // Create random id
        randId = crypto.randomBytes(3).toString('hex');
        code = encryptAES(JSON.stringify(webInfoObj));
        const nativeAdCode = `<script type="text/javascript">
            var adtol_ad_client_${randId} = '${code}';
        </script>
        <script id="${randId}" type="text/javascript" src="${process.env.ORIGIN}/js/native.${scriptEXT}" async defer></script>`;

        // Create Ad Code for pop ad
        webInfoObj.ad_type = 5;
        webInfoObj.ad_banner_size = 0;
        // Create random id
        randId = crypto.randomBytes(3).toString('hex');
        code = encryptAES(JSON.stringify(webInfoObj));
        const popAdCode = `<script type="text/javascript">
            var adtol_ad_client_${randId} = '${code}';
        </script>
        <script id="${randId}" type="text/javascript" src="${process.env.ORIGIN}/js/pop.${scriptEXT}" async defer></script>`;

        // Create Ad Code for feed ad
        webInfoObj.ad_type = 4;
        webInfoObj.ad_banner_size = bInfoObj.dataValues.id; // 300x250
        webInfoObj.ad_count = adCount;
        // Create random id
        randId = crypto.randomBytes(3).toString('hex');
        code = encryptAES(JSON.stringify(webInfoObj));
        const feedAdCode = `<script type="text/javascript">
            var adtol_ad_client_${randId} = '${code}';
        </script>
        <script id="${randId}" type="text/javascript" src="${process.env.ORIGIN}/js/feed.${scriptEXT}" async defer></script>`;


        // Return
        return {
            id: webid,
            text: textAdCode,
            banner: bannerAdCodes,
            native: nativeAdCode,
            pop: popAdCode,
            feed: feedAdCode
        };


        /**
         * webInfo payload:
         * web_id
         * ad_adult
         * ad_type
         * ad_hash => basically domain => unique
         * ad_lang
         * ad_cat
         * ad_banner_size: 0 no banner
         */

        /**
         * Ad types: URL is common
         * text => title, desc => 1
         * banner => title, banner => 2
         * native => title, banner, btn => 3
         * blog => title, desc, banner => 4
         * Pop ads => 5
         */

        



    } catch (err) {
        if(!err.statusCode)
            err.statusCode = 500;
        throw err;
    }
}

exports.formdataHelper = async (req) => {
    
    // Get categories from global settings
    const cats = App_Settings.categories;

    // Get languages from global settings
    const lang = App_Settings.languages;

    // Return 
    return {
        categories: Object.keys(cats).map(key => ({ id: +key, name: cats[key] })),
        languages: Object.keys(lang).map(key => ({ id: +key, name: lang[key] })),
    };
}

const categoryValidation = (value) => {
    if(value == 0) return true; // 0 is all values
        
    const data = App_Settings.categories;

    const values = value.split(',');
    const compareData = Object.keys(data).map(d => +d);

    for(let val of values) {
        if(!compareData.includes(+val)) {
            throw new Error(`Invalid selection for Categories`);
        }
    }
    return true;
}