const { decryptAES } = require("../../common/encrypt");
const Campaigns = require("../../models/campaigns");
const Pub_Sites = require("../../models/publisher_sites");
const psl = require('psl');
const { tinify, extractHostname, extractURL } = require("../../common/util");
const Clicks = require("../../models/clicks");
const sequelize = require("../../utils/db");
const { QueryTypes } = require("sequelize");
const User = require("../../models/users");

exports.processClick = async (req, res, next) => {
    try {
        // Flag for click validity
        let adValidClick = true;
        let pubValidClick = true;

        // Get token from query params
        const token = req.query.tk;

        // Validate token
        const tData = JSON.parse(decryptAES(token));
        
        if(!tData) {
            throw new Error('Malformed Token!');
        }

        // Validate Type
        if(tData.type != 'serve') {
            // Redirect to adtol
            res.redirect(process.env.ORIGIN);
            res.end();
            return next();
        } 

        // Get day and time in unix
        const today = new Date().toISOString().slice(0, 10);
        const day_unix = Math.floor(new Date(today).getTime() / 1000);
        const time_unix = Math.floor(new Date().getTime() / 1000);

        // Unpack ad and user data
        const adData = tData.adData;
        const userData = tData.userData; 

        // Create domain hash
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

        /**
         * Things we need from db
         * ad_uid, pub_uid, ad_url, cpc
         */
        const result = await Promise.all([
            Campaigns.findOne({ where: { id: adData.campaign_id }, attributes: ['uid', 'url', 'cpc', 'pro'] }),
            Pub_Sites.findOne({ where: { id: adData.web_id, hash: domain_hash }, attributes: ['uid', 'status'] })
        ]);

        const campData = result[0];
        const pubData = result[1];

        // Check if campaign and publisher exist (this will never happen)
        if(campData == null || pubData == null) {
            // Redirect to adtol
            res.redirect(process.env.ORIGIN);
            res.end();
            return next();
        }

        // Check time validity
        if(time_unix > tData.time_unix) {
            // Redirect to ad url for backlink
            res.redirect(campData.dataValues.url);
            res.end();
            return next();
        }

        // Check if pub site exists and active
        if(pubData.dataValues.status != 1 || campData.dataValues.pro == 1) {
            pubValidClick = false;
        }

        // Get IP
        const ip = (req.get('x-forwarded-for') || req.connection.remoteAddress).split(',')[0].trim() || req.ip;
        const ip_tiny = tinify(ip);

        
        // Validate adv click
        const acValid = await Clicks.findOne({ where: { ad_id: adData.ad_id, day_unix: day_unix, ip_tiny: ip_tiny }, attributes: ['id'] });
        if(acValid) { // If adv click is invalid then pub click will be invalid too
            adValidClick = false;
            pubValidClick = false;
        }
        else {
            // Check pub clicks
            const pubValid = await Clicks.findOne({ where: { day_unix: day_unix, ip_tiny: ip_tiny }, attributes: ['id'] });
            if(pubValid) {
                pubValidClick = false;
            }
        }

        // Insert Data
        let pub_uid = pubData.dataValues.uid;
        const ad_uid = campData.dataValues.uid;
        const campaign_id = adData.campaign_id;
        const site_id = adData.web_id;
        if(!pubValidClick) pub_uid = 0;
        const ad_url = campData.dataValues.url;
        const ad_url_tiny = tinify(ad_url);
        const pub_url_tiny = tinify(ref_url);
        const ad_cpc = campData.dataValues.cpc;
        const pub_cpc = Math.floor((campData.dataValues.cpc / 2) * 10000) / 10000;

        if(adValidClick) {
            const cInsert = await Clicks.create({
                campaign_id,
                ad_id: adData.ad_id,
                ad_type: adData.ad_type,
                site_id,
                ad_uid,
                pub_uid,
                ad_url,
                ad_url_tiny,
                pub_url: ref_url,
                pub_url_tiny,
                category: userData.category,
                device: userData.device,
                os: userData.os,
                browser: userData.browser,
                language: userData.language,
                country: userData.country,
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
        if(!adValidClick) {
            return next();
        }


        /**
         * Deduct today_budget_rem, increase spent from campaigns
         * Increase ad_spending in users
         */
        // Create transaction
        let ts = await sequelize.transaction();
        try {
            await sequelize.query('UPDATE campaigns SET today_budget_rem = today_budget_rem - ?, spent = spent + ?, clicks = clicks + 1 WHERE id = ?', {
                type: QueryTypes.UPDATE,
                replacements: [ad_cpc, ad_cpc, campaign_id],
                mapToModel: Campaigns,
                transaction: ts
            });

            await sequelize.query('UPDATE users SET ad_spending = ad_spending + ?, ad_clicks = ad_clicks + 1 WHERE id = ?', {
                type: QueryTypes.UPDATE,
                replacements: [ad_cpc, ad_uid],
                mapToModel: User,
                transaction: ts
            });

            /**
            * Update Ad stats
            */
            const adStatRes = await Promise.all([
                executeAdUpdateQuery('summary_device', day_unix, 'device', userData.device, campaign_id, ad_uid, ad_cpc),
                executeAdUpdateQuery('summary_country', day_unix, 'country', userData.country, campaign_id, ad_uid, ad_cpc),
                executeAdUpdateQuery('summary_browser', day_unix, 'browser', userData.browser, campaign_id, ad_uid, ad_cpc),
                executeAdUpdateQuery('summary_os', day_unix, 'os', userData.os, campaign_id, ad_uid, ad_cpc),
            ]);

            await ts.commit();
        } catch (err) {
            await ts.rollback();
            console.log(err);
        }

        /**
         * Increase earned, clicks from pub_sites
         * Increase pub_earnings, pub_balance, pub_clicks in users
         */
        if(pubValidClick) {
            ts = await sequelize.transaction();
            try {
                await sequelize.query('UPDATE pub_sites SET earned = earned + ?, clicks = clicks + 1 WHERE id = ?', {
                    type: QueryTypes.UPDATE,
                    replacements: [pub_cpc, site_id],
                    transaction: ts
                });

                await sequelize.query('UPDATE users SET pub_earnings = pub_earnings + ?, pub_balance = pub_balance + ?, pub_clicks = pub_clicks + 1 WHERE id = ?', {
                    type: QueryTypes.UPDATE,
                    replacements: [pub_cpc, pub_cpc, pub_uid],
                    transaction: ts
                });

                /**
                * Update pub stats
                */
                const pubStatRes = await Promise.all([
                    executePubUpdateQuery('summary_device', day_unix, 'device', userData.device, site_id, pub_uid, pub_cpc),
                    executePubUpdateQuery('summary_country', day_unix, 'country', userData.country, site_id, pub_uid, pub_cpc),
                    executePubUpdateQuery('summary_browser', day_unix, 'browser', userData.browser, site_id, pub_uid, pub_cpc),
                    executePubUpdateQuery('summary_os', day_unix, 'os', userData.os, site_id, pub_uid, pub_cpc),
                ]);

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
    const update = await sequelize.query(`UPDATE ${table} SET clicks = clicks + ${incCount}, cost = cost + ? WHERE day_unix = ? AND ${col} = ? AND campaign = ? AND ad_uid = ?`, {
        type: QueryTypes.UPDATE,
        replacements: [cpc, day_unix, value, campaign, ad_uid]
    });
    if (update[1] < 1) {
        executeInsertQuery(table, day_unix, col, value, campaign, null, ad_uid, null, cpc);
    }

    return true;
}

const executePubUpdateQuery = async (table, day_unix, col, value, website, pub_uid, cpc) => {
    const incCount = 1;
    const update = await sequelize.query(`UPDATE ${table} SET clicks = clicks + ${incCount}, cost = cost + ? WHERE day_unix = ? AND ${col} = ? AND website = ? AND pub_uid = ?`, {
        type: QueryTypes.UPDATE,
        replacements: [cpc, day_unix, value, website, pub_uid]
    });
    if (update[1] < 1) {
        executeInsertQuery(table, day_unix, col, value, null, website, null, pub_uid, cpc);
    }

    return true;
}

const executeInsertQuery = async (table, day_unix, col, value, campaign, website, ad_uid, pub_uid, cost, viewCount = 0, clicks = 1) => {
    if (campaign) {
      return sequelize.query(
        `INSERT INTO ${table} (ad_uid, ${col}, campaign, views, day_unix, cost, clicks) VALUES(?, ?, ?, ?, ?, ?, ?)`,
        {
          type: QueryTypes.INSERT,
          replacements: [ad_uid, value, campaign, viewCount, day_unix, cost, clicks]
        }
      );
    }
  
    if (website) {
      return sequelize.query(
        `INSERT INTO ${table} (pub_uid, ${col}, website, views, day_unix, cost, clicks) VALUES(?, ?, ?, ?, ?, ?, ?)`,
        {
          type: QueryTypes.INSERT,
          replacements: [pub_uid, value, website, viewCount, day_unix, cost, clicks]
        }
      );
    }
    return;
  };
  
