const psl = require('psl');
const { QueryTypes } = require('sequelize');
const { tinify, extractHostname, extractURL } = require('../../common/util');
const sequelize = require('../../utils/db');
const Pub_Sites = require('../../models/publisher_sites');
const { encryptAES } = require('../../common/encrypt');
const Btns = require('../../models/btn');
const Views = require('../../models/views');
const { secretory } = require('../../common/secretory');

exports.adServe = async (req, res, next) => {
    /**
     * Validation middleware before this, so this is safe
     *  */ 
    try {
        /**
         * Ad types: URL is common
         * text => title, desc => 1
         * banner => title, banner => 2
         * native => title, banner, btn => 3
         * blog => title, desc, banner => 4
         * Pop ads are separate
         */

        // Check type of ad
        const ad_type = +req.webInfo.ad_type;

        /**
         * webInfo payload:
         * web_id
         * ad_adult
         * ad_type
         * ad_hash => basically domain => unique
         * ad_lang
         * ad_cat
         * ad_banner_size: 0 no banner
         * 
         * What of admin blocks certain site?
         * do I check if site is valid before sending content? right now no
         */

        // Get payload
        const web_id = +req.webInfo.web_id;
        const ad_cat = +req.webInfo.ad_cat;
        const ad_lang = +req.webInfo.ad_lang;
        const hash = req.webInfo.ad_hash;
        let banner_size = req.webInfo.ad_banner_size; // Array if native
        if(ad_type == 3) banner_size = banner_size.toString();
        // const ad_count = req.webInfo.ad_count;
        
        // Construct domain hash from ref url
        const match_hash = req.match_hash;
        const ref_url = extractURL(req.query.ref || req.get('Referrer')) || null;
        if(!ref_url) throw new Error('Invalid URL');
        const origin = extractHostname(ref_url);
        // const ref_url = "https://example.com/test.html".split('//')[1];
        // const origin = "https://example.com".split('//')[1];
        let parsed = psl.parse(origin); 
        const domain = parsed.domain;
        const domain_hash = tinify(domain);

        // Match domain hash with token hash
        if(domain_hash != hash) {
            throw new Error(`Domain Mismatch - ${ref_url} - ${origin}`);
        }

        /**
         * Get user country device and other codes
         */
        // device code
        const dCode = req.dCode;

        // Find user os code
        const oCode = req.oCode;

        // Get Browser Code
        const bCode = req.bCode;

        // Find country code
        const cCode = req.cCode;

        /**
         * Ad serve constraint to match via db => match_hash(bot,status,type,adult,run), today_budget_rem, domain_hash, size
         * Limit the search space to 25000
         *  */ 

        // Common query
        sQuery = `SELECT c.id as campaign_id, a.id as ad_id, c.uid as ad_uid, c.campaign_type, c.title, c.desc, c.url, c.category, c.country, c.device, c.os, c.browser, c.language, c.adult, c.rel, c.btn, c.cpc, c.pro`;
        wQuery = `WHERE a.match_hash = '${match_hash}' AND c.today_budget_rem >= 0.1 AND c.domain_hash != '${domain_hash}'`;

        // Queries
        const queries = {
            1: `${sQuery} FROM campaigns c INNER JOIN ads a ON c.id = a.campaign_id ${wQuery} ORDER BY RAND() LIMIT 25000`, // text ad
            2: `${sQuery}, b.src FROM campaigns c INNER JOIN ads a ON c.id = a.campaign_id INNER JOIN banners b ON c.id = b.campaign_id ${wQuery} AND b.size IN (${banner_size}) ORDER BY RAND() LIMIT 25000` // native, blog, banner
        }

        let queryToExe = 1;
        if(ad_type != 1)
            queryToExe = 2;

        const result = await sequelize.query(queries[queryToExe], {
            type: QueryTypes.SELECT
        });
        
        // If not ad Found
        if(result.length < 1) {
            const err = new Error('No Ads Found!');
            err.statusCode = 404;
            throw err;
        }

        // Ad Matching with secretory problem
        const adKeyArr = secretory(result, req);

        // Check if publisher website approved
        let webValid = 0;
        const ps = await Pub_Sites.findOne({ where: { id: web_id, hash: domain_hash, status: 1 }, attributes: ['id', 'uid'] }); 
        if(ps) webValid = 1;

        // Response object
        let resObj = [];

        // Foreach errors
        const forEachErr = [];
        for(const bestAdIndex of adKeyArr) {
            /**
             *  Create url link
             *  Data we need for click verify campaign id, ad_id, ad_uid(db), pub_uid(get from db), ad_type, cpc, website id, timeunix
             *  add user data cat, device, os, browser, language, country
             *  */
            const adData = {};
            adData.campaign_id = result[bestAdIndex].campaign_id;
            adData.ad_id = result[bestAdIndex].ad_id;
            adData.ad_type = ad_type;
            // adData.cpc = result[bestAdIndex].cpc; get from db
            adData.web_id = ps?.dataValues.id || 0;
            // adData.pro = result[bestAdIndex].pro; get from db

            const userData = {};
            userData.country = cCode;
            userData.category = ad_cat;
            userData.lang = ad_lang;
            userData.device = dCode;
            userData.browser = bCode;
            userData.os = oCode;

            const linkData = {};
            linkData.adData = adData;
            linkData.userData = userData;
            linkData.type = 'serve';
            linkData.time_unix = Math.floor(new Date().getTime() / 1000) + 600; // Valid for 10 minutes

            const link = process.env.ORIGIN + '/api/display/pcs/click?tk=' + encryptAES(JSON.stringify(linkData));

            // Get domain from url
            parsed = psl.parse(extractHostname(result[bestAdIndex].url));
            const ad_domain = parsed.domain; 

            // Get btn if exist
            let btnText = 'Visit'; 
            if(ad_type == 3 && result[bestAdIndex].btn != 0) {
                const btnQuery = await Btns.findOne({ where: { id: result[bestAdIndex].btn }, attributes: ['name'] });
                btnText = btnQuery?.dataValues.name || 'Visit';
            }
           
            // Construct ad
            const ad = {};
            ad.title = result[bestAdIndex].title;
            ad.desc = result[bestAdIndex].desc;
            ad.rel = result[bestAdIndex].rel;
            ad.btn = btnText;
            ad.domain = ad_domain;
            ad.banner = `${process.env.CLOUDFRONT_S3_ORIGIN}${result[bestAdIndex].src}`;
            ad.process = link;

            resObj.push(ad);
        }
        
        if(forEachErr.length > 0) {
            throw new Error(forEachErr.join());
        }
        
        resObj = Object.assign({}, resObj); // Another way to convert arr to obj without spread operator

        // Response
        res.status(200).json({
            ads: resObj,
            adchoices: `${process.env.CLOUDFRONT_S3_ORIGIN}info.svg`
        });
        res.end();

        for(const bestAdIndex of adKeyArr) {
            try {
                // Check if website valid then count view
                if(webValid == 1) {
                    // Tinify
                    const ad_url_tiny = tinify(result[bestAdIndex].url);
                    const pub_url_tiny = tinify(ref_url);

                    // Get day time
                    const date = new Date().toISOString().slice(0, 10);
                    const today_unix = Math.floor(new Date(date).getTime() / 1000);
                    const time_unix = Math.floor(new Date().getTime() / 1000);

                    // Data
                    const ad_uid = result[bestAdIndex].ad_uid;
                    const pub_uid = ps.dataValues.uid;
                    const ad_id = result[bestAdIndex].ad_id;
                    const site_id = ps.dataValues.id;
                    const ad_url = result[bestAdIndex].url;
                    const campaign_id = result[bestAdIndex].campaign_id;
                    const ad_adult = result[bestAdIndex].adult || 0;
                    const ad_cpc = result[bestAdIndex].cpc;
                    const campaign_type = result[bestAdIndex].campaign_type;
                    // Store view
                    const viewStore = Views.create({
                        campaign_id,
                        ad_uid,
                        pub_uid,
                        ad_id,
                        site_id,
                        ad_url,
                        ad_url_tiny,
                        pub_url: ref_url,
                        pub_url_tiny,
                        ad_type,
                        campaign_type,
                        category: ad_cat,
                        device: dCode,
                        os: oCode, 
                        browser: bCode,
                        country: cCode,
                        language: ad_lang,
                        adult: ad_adult,
                        ad_cpc: ad_cpc,
                        ip: req.ip_addr,
                        processed: 0,
                        day_unix: today_unix,
                        time_unix: time_unix
                    });

                    /**
                     * Code below is moved to cron job
                     */

                    // Increase view count
                    // await sequelize.query('UPDATE users u SET u.ad_views = u.ad_views + 1 WHERE u.id = ?', {
                    //     type: QueryTypes.UPDATE,
                    //     replacements: [ad_uid]
                    // });
                    // await sequelize.query('UPDATE campaigns c SET c.views = c.views + 1 WHERE c.id = ?', {
                    //     type: QueryTypes.UPDATE,
                    //     replacements: [campaign_id]
                    // });
                    // await sequelize.query('UPDATE users u SET u.pub_views = u.pub_views + 1 WHERE u.id = ?', {
                    //     type: QueryTypes.UPDATE,
                    //     replacements: [pub_uid]
                    // });
                    // await sequelize.query('UPDATE pub_sites ps SET ps.views = ps.views + 1 WHERE ps.id = ?', {
                    //     type: QueryTypes.UPDATE,
                    //     replacements: [site_id]
                    // });

                    /**
                     * Update stats
                     */
                    // const statRes = await Promise.all([
                    //     executeUpdateQuery('summary_device', today_unix, 'device', dCode, campaign_id, site_id, ad_uid, pub_uid),
                    //     executeUpdateQuery('summary_country', today_unix, 'country', cCode, campaign_id, site_id, ad_uid, pub_uid),
                    //     executeUpdateQuery('summary_browser', today_unix, 'browser', bCode, campaign_id, site_id, ad_uid, pub_uid),
                    //     executeUpdateQuery('summary_os', today_unix, 'os', oCode, campaign_id, site_id, ad_uid, pub_uid),
                    // ]);

                    /**
                     * Check affected rows else create new record
                     */
                    // if(statRes[0][1] < 2) {
                    //     executeInsertQuery('summary_device', today_unix, 'device', dCode, campaign_id, site_id, ad_uid, pub_uid);
                    // }
                    // if(statRes[1][1] < 2) {
                    //     executeInsertQuery('summary_country', today_unix, 'country', cCode, campaign_id, site_id, ad_uid, pub_uid);
                    // }
                    // if(statRes[2][1] < 2) {
                    //     executeInsertQuery('summary_browser', today_unix, 'browser', bCode, campaign_id, site_id, ad_uid, pub_uid);
                    // }
                    // if(statRes[3][1] < 2) {
                    //     executeInsertQuery('summary_os', today_unix, 'os', oCode, campaign_id, site_id, ad_uid, pub_uid);
                    // }
                }
            } catch(err) {
                console.log(err);
            }
        }
        
    } catch(err) {
        if(!err.statusCode)
            err.statusCode = 500
        next(err);
    }
}

/**
 * @returns {Promise} 
 * @resolve {Array} [empty, affected rows]
 * Used in Ad serving and process
 */
const executeUpdateQuery = async (table, day_unix, col, value, campaign, website, ad_uid, pub_uid) => {
    const incCount = 1;
    
    const update1 = await sequelize.query(`UPDATE ${table} SET views = views + ${incCount} WHERE day_unix = ? AND ${col} = ? AND campaign = ? AND ad_uid = ?`, {
            type: QueryTypes.UPDATE,
            replacements: [day_unix, value, campaign, ad_uid]
        });
    const update2 = await sequelize.query(`UPDATE ${table} SET views = views + ${incCount} WHERE day_unix = ? AND ${col} = ? AND website = ? AND pub_uid = ?`, {
            type: QueryTypes.UPDATE,
            replacements: [day_unix, value, website, pub_uid]
        });

    return [null, Number(update1[1] + update2[1])];
}

/**
 * @returns {True}
 * Used in Ad serving and process
 * Inserts data in summary tables
 */
const executeInsertQuery = async (table, day_unix, col, value, campaign, website, ad_uid, pub_uid) => {
    const viewCount = 1;

    const adRows = await sequelize.query(`SELECT COUNT(id) as count FROM ${table} WHERE day_unix = ? AND ${col} = ? AND campaign = ? AND ad_uid = ?`, {
        type: QueryTypes.SELECT,
        replacements: [day_unix, value, campaign, ad_uid]
    });
    if(adRows[0].count == 0) {
        sequelize.query(`INSERT INTO ${table} (ad_uid, ${col}, campaign, views, day_unix) VALUES(?, ?, ?, ?, ?)`, {
            type: QueryTypes.INSERT,
            replacements: [ad_uid, value, campaign, viewCount, day_unix]
        });
    }

    const pubRows = await sequelize.query(`SELECT COUNT(id) as count FROM ${table} WHERE day_unix = ? AND ${col} = ? AND website = ? AND pub_uid = ?`, {
        type: QueryTypes.SELECT,
        replacements: [day_unix, value, website, pub_uid]
    });
    if(pubRows[0].count == 0) {
        sequelize.query(`INSERT INTO ${table} (pub_uid, ${col}, website, views, day_unix) VALUES(?, ?, ?, ?, ?)`, {
            type: QueryTypes.INSERT,
            replacements: [pub_uid, value, website, viewCount, day_unix]
        });
    }
    return true;
}
