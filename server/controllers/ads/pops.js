const Campaigns = require("../../models/campaigns");
const Pub_Sites = require("../../models/publisher_sites");
const Pops = require("../../models/pops");
const psl = require('psl');
const { tinify, extractHostname, extractURL } = require("../../common/util");
const sequelize = require("../../utils/db");
const { QueryTypes } = require("sequelize");
const User = require("../../models/users");
const { secretory } = require('../../common/secretory');

exports.processPop = async (req, res, next) => {
    try {
        // Flag for click validity
        let adValidPop = true;
        let pubValidPop = true;

        // Get ad_type
        if(req.webInfo.ad_type != 5) { // Will not execute ever if I did it right
            res.redirect(process.env.ORIGIN);
            res.end();
            return next();
        }
        const ad_type = 5; // ad_type 5 is pop

        /**
         * Match pop ad
         */
        const ad_lang = req.webInfo.ad_lang;
        const ad_cat = req.webInfo.ad_cat;
        const ad_hash = req.webInfo.ad_hash;

        // Website id
        const web_id = +req.webInfo.web_id;
        
        // Create match_hash bot|status|type|adult|run
        const match_hash = req.match_hash;
        // Construct domain hash
        let ref_url;
        try {
            ref_url = extractURL(req.query.ref || req.get('Referrer')) || null;
            if(!ref_url) throw new Error('Invalid URL');
        } catch (err) {
            // If ref url null
            res.redirect(process.env.ORIGIN);
            res.end();
            return next();
        }
        const origin = extractHostname(ref_url);
        // const ref_url = "https://example.com/test.html".split('//')[1];
        // const origin = "https://example.com".split('//')[1];
        let parsed = psl.parse(origin);
        const domain = parsed.domain;
        const domain_hash = tinify(domain);

        // Match domain hash with token hash
        if(domain_hash != ad_hash) { 
            res.redirect(process.env.ORIGIN);
            res.end();
            return next();
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
        sQuery = `SELECT c.id as campaign_id, a.id as ad_id, c.uid as ad_uid, c.url, c.category, c.country, c.device, c.os, c.browser, c.language, c.cpc, c.pro`;
        wQuery = `WHERE a.match_hash = '${match_hash}' AND c.today_budget_rem >= 0.1 AND c.domain_hash != '${domain_hash}'`;

        // Queries
        const queryExe = `${sQuery} FROM campaigns c INNER JOIN ads a ON c.id = a.campaign_id ${wQuery} ORDER BY RAND() LIMIT 25000`;

        const result = await sequelize.query(queryExe, {
            type: QueryTypes.SELECT
        });

        // If not ad Found
        if(result.length < 1) {
            res.redirect(process.env.ORIGIN);
            res.end();
            return next();
        }

        // Ad Matching with secretory problem
        const adKeyArr = secretory(result, req);
        
        // Best ad data
        const adData = result[adKeyArr[0]];

        // Get day and time in unix
        const today = new Date().toISOString().slice(0, 10);
        const day_unix = Math.floor(new Date(today).getTime() / 1000);
        const time_unix = Math.floor(new Date().getTime() / 1000);    

        /**
         * Things we need from db
         * pub_uid, status, web id
         */
        const pubData = await Pub_Sites.findOne({ where: { id: web_id, hash: domain_hash }, attributes: ['id', 'uid', 'status'] });

        // Check if campaign and publisher exist (this will never happen)
        if(pubData == null) { 
            // Redirect to adtol
            res.redirect(process.env.ORIGIN);
            res.end();
            return next();
        }

        // Check if pub site exists and active
        if(pubData.dataValues.status != 1 || adData.pro == 1) {
            pubValidPop = false;
        }

        // Get IP
        const ip = req.ip_addr;
        const ip_tiny = tinify(ip);

        // Validate adv pop
        const apValid = await Pops.findOne({ where: { ad_id: adData.ad_id, day_unix: day_unix, ip_tiny: ip_tiny }, attributes: ['id'] });
        if(apValid) { // If adv click is invalid then pub click will be invalid too
            adValidPop = false;
            pubValidPop = false;
        }
        else {
            // Check pub pop
            const pubValid = await Pops.findOne({ where: { day_unix: day_unix, ip_tiny: ip_tiny }, attributes: ['id'] });
            if(pubValid) {
                pubValidPop = false;
            }
        }

        
        // Insert Data
        let pub_uid = pubData.dataValues.uid;
        const ad_uid = adData.ad_uid;
        const campaign_id = adData.campaign_id;
        const site_id = pubData.dataValues.id;
        if(!pubValidPop) pub_uid = 0;
        const ad_url = adData.url;
        const ad_url_tiny = tinify(ad_url);
        const pub_url_tiny = tinify(ref_url);
        const ad_cpc = adData.cpc;
        const pub_cpc = Math.floor((adData.cpc / 2) * 10000) / 10000;

        if(adValidPop) {
            const pInsert = await Pops.create({
                campaign_id,
                ad_id: adData.ad_id,
                site_id,
                ad_uid,
                pub_uid,
                ad_url,
                ad_url_tiny,
                pub_url: ref_url,
                pub_url_tiny,
                category: ad_cat,
                device: dCode,
                os: oCode,
                browser: bCode,
                language: ad_lang,
                country: cCode,
                ip,
                ip_tiny,
                ad_cpc,
                pub_cpc,
                day_unix,
                time_unix
            });
        }

        // Redirect to ad url
        res.redirect(ad_url); 
        res.end();

        // If NOT adValidClick then we don't count anything
        if(!adValidPop) {
            return next();
        }


        /**
         * Deduct today_budget_rem, increase spent from campaigns
         * Increase ad_spending in users
         */
        // Create transaction
        let ts = await sequelize.transaction();
        try {
            await sequelize.query('UPDATE campaigns SET today_budget_rem = today_budget_rem - ?, spent = spent + ?, pops = pops + 1 WHERE id = ?', {
                type: QueryTypes.UPDATE,
                replacements: [ad_cpc, ad_cpc, campaign_id],
                mapToModel: Campaigns,
                transaction: ts
            });

            await sequelize.query('UPDATE users SET ad_spending = ad_spending + ?, ad_pops = ad_pops + 1 WHERE id = ?', {
                type: QueryTypes.UPDATE,
                replacements: [ad_cpc, ad_uid],
                mapToModel: User,
                transaction: ts
            });

            /**
            * Update Ad stats
            */
            const adStatRes = await Promise.all([
                executeAdUpdateQuery('summary_device', day_unix, 'device', dCode, campaign_id, ad_uid, ad_cpc),
                executeAdUpdateQuery('summary_country', day_unix, 'country', cCode, campaign_id, ad_uid, ad_cpc),
                executeAdUpdateQuery('summary_browser', day_unix, 'browser', bCode, campaign_id, ad_uid, ad_cpc),
                executeAdUpdateQuery('summary_os', day_unix, 'os', oCode, campaign_id, ad_uid, ad_cpc),
            ]);

            /**
             * Check affected rows else create new record
             */
            if(adStatRes[0][1] < 1) {
                executeAdInsertQuery('summary_device', day_unix, 'device', dCode, campaign_id, ad_uid, ad_cpc);
            }
            if(adStatRes[1][1] < 1) {
                executeAdInsertQuery('summary_country', day_unix, 'country', cCode, campaign_id, ad_uid, ad_cpc);
            }
            if(adStatRes[2][1] < 1) {
                executeAdInsertQuery('summary_browser', day_unix, 'browser', bCode, campaign_id, ad_uid, ad_cpc);
            }
            if(adStatRes[3][1] < 1) {
                executeAdInsertQuery('summary_os', day_unix, 'os', oCode, campaign_id, ad_uid, ad_cpc);
            }

            await ts.commit();
        } catch (err) {
            await ts.rollback();
            console.log(err);
        }

        /**
         * Increase earned, clicks from pub_sites
         * Increase pub_earnings, pub_balance, pub_clicks in users
         */
        if(pubValidPop) {
            ts = await sequelize.transaction();
            try {
                await sequelize.query('UPDATE pub_sites SET earned = earned + ?, pops = pops + 1 WHERE id = ?', {
                    type: QueryTypes.UPDATE,
                    replacements: [pub_cpc, site_id]
                });

                await sequelize.query('UPDATE users SET pub_earnings = pub_earnings + ?, pub_balance = pub_balance + ?, pub_pops = pub_pops + 1 WHERE id = ?', {
                    type: QueryTypes.UPDATE,
                    replacements: [pub_cpc, pub_cpc, pub_uid]
                });

                /**
                * Update pub stats
                */
                const pubStatRes = await Promise.all([
                    executePubUpdateQuery('summary_device', day_unix, 'device', dCode, site_id, pub_uid, pub_cpc),
                    executePubUpdateQuery('summary_country', day_unix, 'country', cCode, site_id, pub_uid, pub_cpc),
                    executePubUpdateQuery('summary_browser', day_unix, 'browser', bCode, site_id, pub_uid, pub_cpc),
                    executePubUpdateQuery('summary_os', day_unix, 'os', oCode, site_id, pub_uid, pub_cpc),
                ]);

                /**
                 * Check affected rows else create new record
                 */
                if(pubStatRes[0][1] < 1) {
                    executePubInsertQuery('summary_device', day_unix, 'device', dCode, site_id, pub_uid, pub_cpc);
                }
                if(pubStatRes[1][1] < 1) {
                    executePubInsertQuery('summary_country', day_unix, 'country', cCode, site_id, pub_uid, pub_cpc);
                }
                if(pubStatRes[2][1] < 1) {
                    executePubInsertQuery('summary_browser', day_unix, 'browser', bCode, site_id, pub_uid, pub_cpc);
                }
                if(pubStatRes[3][1] < 1) {
                    executePubInsertQuery('summary_os', day_unix, 'os', oCode, site_id, pub_uid, pub_cpc);
                }

                await ts.commit();
            } catch (err) {
                await ts.rollback();
                console.log(err);
            }
        }

    } catch (err) {
        if(!err.statusCode)
            err.statusCode = 500;
        next(err);
    } 
}

/**
 * @returns {Promise} 
 * @resolve {Array} [empty, affected rows]
 * Used in Ad serving and process
 */
const executeAdUpdateQuery = async (table, day_unix, col, value, campaign, ad_uid, cpc) => {
    const incCount = 1;
    return sequelize.query(`UPDATE ${table} SET pops = pops + ${incCount}, cost = cost + ? WHERE day_unix = ? AND ${col} = ? AND campaign = ? AND ad_uid = ?`, {
        type: QueryTypes.UPDATE,
        replacements: [cpc, day_unix, value, campaign, ad_uid]
    });
}

const executeAdInsertQuery = async (table, day_unix, col, value, campaign, ad_uid, cpc) => {
    const count = 1;
    sequelize.query(`INSERT INTO ${table} (ad_uid, ${col}, campaign, pops, cost, day_unix) VALUES (?, ?, ?, ?, ?, ?)`, {
        type: QueryTypes.INSERT,
        replacements: [ad_uid, value, campaign, count, cpc, day_unix]
    });
    return true;
}

const executePubUpdateQuery = async (table, day_unix, col, value, website, pub_uid, cpc) => {
    const incCount = 1;
    return sequelize.query(`UPDATE ${table} SET pops = pops + ${incCount}, cost = cost + ? WHERE day_unix = ? AND ${col} = ? AND website = ? AND pub_uid = ?`, {
        type: QueryTypes.UPDATE,
        replacements: [cpc, day_unix, value, website, pub_uid]
    });
}

const executePubInsertQuery = async (table, day_unix, col, value, website, pub_uid, cpc) => {
    const count = 1;
    sequelize.query(`INSERT INTO ${table} (pub_uid, ${col}, website, pops, cost, day_unix) VALUES (?, ?, ?, ?, ?, ?)`, {
        type: QueryTypes.INSERT,
        replacements: [pub_uid, value, website, count, cpc, day_unix]
    });
    return true;
}
