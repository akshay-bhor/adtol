const { decryptAES } = require("../../common/encrypt");
const Campaigns = require("../../models/campaigns");
const Pub_Sites = require("../../models/publisher_sites");
const psl = require('psl');
const { tinify } = require("../../common/util");
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
            res.redirect('https://' + req.get('host'));
            res.end();
            return next();
        } 

        // Get day and time in unix
        const today = new Date().toISOString().slice(0, 10);
        const day_unix = Math.floor(new Date(today).getTime() / 1000);
        const time_unix = Math.floor(new Date().getTime() / 1000);

        // Check time validity
        if(time_unix > tData.time_unix) {
            // Redirect to adtol
            res.redirect('https://' + req.get('host'));
            res.end();
            return next();
        }

        // Unpack ad and user data
        const adData = tData.adData;
        const userData = tData.userData; 

        // Create domain hash
        // const ref_url = req.get('Referrer').split('//')[1];
        // const origin = req.get('origin').split('//')[1];
        const ref_url = "https://example.com/test.html".split('//')[1];
        const origin = "https://example.com".split('//')[1];
        let parsed = psl.parse(origin);
        const domain = parsed.domain;
        const domain_hash = tinify(domain);

        /**
         * Things we need from db
         * ad_uid, pub_uid, ad_url, cpc
         */
        const result = await Promise.all([
            await Campaigns.findOne({ where: { id: adData.campaign_id }, attributes: ['uid', 'url', 'cpc', 'pro'] }),
            await Pub_Sites.findOne({ where: { id: adData.web_id, hash: domain_hash }, attributes: ['uid', 'status'] })
        ]);

        const campData = result[0];
        const pubData = result[1];

        // Check if campaign and publisher exist (this will never happen)
        if(campData == null || pubData == null) {
            // Redirect to adtol
            res.redirect('https://' + req.get('host'));
            res.end();
            return next();
        }

        // Check if pub site exists and active
        if(pubData.dataValues.status != 1 || campData.dataValues.pro == 1) {
            pubValidClick = false;
        }

        // Get IP
        const ip = req.ip;
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
        if(!pubValidClick) pub_uid = 0;
        const ad_url = campData.dataValues.url;
        const ad_url_tiny = tinify(ad_url);
        const pub_url_tiny = tinify(ref_url);
        const ad_cpc = campData.dataValues.cpc;
        const pub_cpc = Math.floor((campData.dataValues.cpc / 2) * 10000) / 10000;

        if(adValidClick) {
            const cInsert = await Clicks.create({
                campaign_id: adData.campaign_id,
                ad_id: adData.ad_id,
                ad_type: adData.ad_type,
                site_id: adData.web_id,
                ad_uid: campData.dataValues.uid,
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
        res.redirect('http://' + ad_url);
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
                replacements: [ad_cpc, ad_cpc, adData.campaign_id],
                mapToModel: Campaigns,
                transaction: ts
            });

            await sequelize.query('UPDATE users SET ad_spending = ad_spending + ?, ad_clicks = ad_clicks + 1 WHERE id = ?', {
                type: QueryTypes.UPDATE,
                replacements: [ad_cpc, campData.dataValues.uid],
                mapToModel: User,
                transaction: ts
            });

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
                    replacements: [pub_cpc, adData.web_id]
                });

                await sequelize.query('UPDATE users SET pub_earnings = pub_earnings + ?, pub_balance = pub_balance + ?, pub_clicks = pub_clicks + 1 WHERE id = ?', {
                    type: QueryTypes.UPDATE,
                    replacements: [pub_cpc, pub_cpc, pub_uid]
                });

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