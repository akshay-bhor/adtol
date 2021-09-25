const { check, validationResult } = require("express-validator");
const { executeAllQueries } = require('../../../common/util');
const { App_Settings } = require('../../../common/settings');

exports.reportsHelper = async (req) => {
    if(!req.userInfo) {
        const err = new Error('Not Allowed!');
        err.statusCode = 401;
        throw err;
    }

    await check('duration').exists().withMessage('Duration not Posted!').trim().isInt().withMessage('Invalid duration!').escape().run(req);
    if(req.params.type == 'advertiser')
        await check('campaign').exists().withMessage('Campaign not posted!').trim().isInt().withMessage('Invalid Campaign!').escape().run(req);
    if(req.params.type == 'publisher')
        await check('website').exists().withMessage('Website not posted!').trim().isInt().withMessage('Invalid Website!').escape().run(req);

    try {
        const errs = validationResult(req);
        if(!errs.isEmpty()) {
            const err = new Error('Validation Failed!');
            err.statusCode = 422;
            err.data = errs.array();
            throw err;
        }

        // Validate report type
        const reportType = req.params.type;
        if(reportType != 'advertiser' && reportType != 'publisher') {
            const err = new Error('URL Not Found!');
            err.statusCode = 404;
            throw err;
        }

        const duration = req.body.duration;
        let campId;
        let webId;
        if(reportType == 'advertiser')
            campId = req.body.campaign;
        if(reportType == 'publisher')
            webId = req.body.website; 
        const userid = req.userInfo.id;

        /**
         * durations
         * 1 -> today
         * 2 -> this week
         * 3 -> last week
         * 4 -> this month
         * 5 -> last month
         * campaigns
         * 0 -> all
         * id -> particular
         */
        /**
         * build query
         */

        // Validate Duration
        if(duration < 1 || duration > 5) {
            const err = new Error('Invalid Duration!');
            err.statusCode = 422;
            throw err;
        }

        // Duartion
        let tunix;
        // Today unix 
        let date = new Date().toISOString().slice(0, 10);
        let today_unix = Math.floor(new Date(date).getTime() / 1000);

        if(duration == 1) {
            // Today unix 
            tunix = today_unix;
        }
        if(duration == 2) {
            // This week unix
            tunix = Math.floor(today_unix - (60*60*24*7));
        }
        if(duration == 3) {
            // Last 2 Week unix
            tunix = Math.floor(today_unix - (60*60*24*14));
        }
        if(duration == 4) {
            // This month unix 
            tunix = Math.floor(today_unix - (60*60*24*30));
        }
        if(duration == 5) {
            // Last 2 month unix 
            tunix = Math.floor(today_unix - (60*60*24*60));
        }

        // Build WHERE clause
        let cond;
        if(reportType == 'advertiser') {
            if(campId != 0)
                cond = 'ad_uid = '+ userid +' AND day_unix >= '+ tunix +' AND campaign = '+ campId;
            else
                cond = 'ad_uid = '+ userid +' AND day_unix >= '+ tunix;
        }
        if(reportType == 'publisher') {
            if(webId != 0)
                cond = 'pub_uid = '+ userid +' AND day_unix >= '+ tunix +' AND website = '+ webId;
            else
                cond = 'pub_uid = '+ userid +' AND day_unix >= '+ tunix;
        }

        const queries = [
            { "name": "stats", "query": "SELECT SUM(views) as views, SUM(clicks) as clicks, SUM(pops) as pops, SUM(cost) as cost, day_unix FROM summary_device WHERE "+ cond +" GROUP BY day_unix ORDER BY day_unix DESC" },

            { "name": "countrystats", "query": "SELECT SUM(views) as cviews, SUM(clicks) as cclicks, SUM(pops) as cpops, SUM(cost) as ccost, country FROM summary_country WHERE "+ cond +" GROUP BY country" },

            { "name": "devicestats", "query": "SELECT SUM(views) as dviews, SUM(clicks) as dclicks, SUM(pops) as dpops, SUM(cost) as dcost, device FROM summary_device WHERE "+ cond +" GROUP BY device" },

            { "name": "osstats", "query": "SELECT SUM(views) as osviews, SUM(clicks) as osclicks, SUM(pops) as ospops, SUM(cost) as oscost, os FROM summary_os WHERE "+ cond +" GROUP BY os" },

            { "name": "browserstats", "query": "SELECT SUM(views) as bviews, SUM(clicks) as bclicks, SUM(pops) as bpops, SUM(cost) as bcost, browser FROM summary_browser WHERE "+ cond +" GROUP BY browser" },
        ];

        // Append to query array according to report type
        if(reportType == 'advertiser') {
            queries.push(
                { "name": "campstats", "query": "SELECT SUM(views) as cmviews, SUM(pops) as cmpops, SUM(clicks) as cmclicks, SUM(cost) as cmcost, campaign as campaign_id from summary_device WHERE "+ cond +" GROUP BY campaign" },
                { "name": "campaigns", "query": "SELECT id, campaign_title FROM campaigns WHERE uid = "+ userid +" AND status = 1" },
            );
        }
        if(reportType == 'publisher') {
            queries.push(
                { "name": "webstats", "query": "SELECT SUM(views) as wviews, SUM(pops) as wpops, SUM(clicks) as wclicks, SUM(cost) as wcost, website as site_id from summary_device WHERE "+ cond +" GROUP BY website" },
                { "name": "websites", "query": "SELECT id, domain FROM pub_sites WHERE uid = "+ userid +" AND status = 1" }
            );
        }



        const result = await executeAllQueries(queries);
        const statRes = result[0];
        const countryRes = result[1];
        const deviceRes = result[2];
        const osRes = result[3];
        const browserRes = result[4];
        const eleRes = result[5];
        const elements = result[6];

        // Views clicks
        const views_clicks = {};
        let day_duration = 1;
        if(duration == 2) {
            // This week 
            day_duration = 7;
        }
        if(duration == 3) {
            // Last 2 Week 
            day_duration = 14;
        }
        if(duration == 4) {
            // This month 
            day_duration = 30;
        }
        if(duration == 5) {
            // Last 2 month 
            day_duration = 60;
        }
        let ci = 0;
        for(let i = 0;i < day_duration;i++) {

            let minus_unix = 0;
            if(i != 0) minus_unix = (60*60*24*i);

            if(statRes[ci] && statRes[ci].day_unix == (today_unix - minus_unix)) {
                let date = new Date((statRes[ci].day_unix * 1000)).toISOString();
                date = date.slice(0, 10); 

                if(!views_clicks[date]) views_clicks[date] = {};

                views_clicks[date].clicks = statRes[ci].clicks || 0; 
                views_clicks[date].cost = statRes[ci].cost || 0;
                views_clicks[date].views = statRes[ci].views || 0;
                views_clicks[date].pops = statRes[ci].pops || 0;
                ci++;
            }
            else {
                let date = new Date((today_unix - minus_unix) * 1000).toISOString();
                date = date.slice(0, 10); 

                if(!views_clicks[date]) views_clicks[date] = {};

                views_clicks[date].clicks = 0; 
                views_clicks[date].cost = 0;
                views_clicks[date].views = 0;
                views_clicks[date].pops = 0;
            }
        }

        // Views pops and clicks by country
        i = 0;
        const byCountry = {};
        while(true) {
            if(!countryRes[i]) break;

            let code = countryRes[i].country;
            let cname = App_Settings.countries[code][1];

            if(!byCountry[cname]) byCountry[cname] = {};

            byCountry[cname].clicks = countryRes[i].cclicks || 0;
            byCountry[cname].cost = countryRes[i].ccost || 0;
            byCountry[cname].views = countryRes[i].cviews || 0;
            byCountry[cname].pops = countryRes[i].cpops || 0;

            i++;
        }


        // By elements -> campaign for advertiser, websites for publishers
        const byElements = {};
        if(reportType == 'advertiser') {
            elements.forEach(data => {
                let campaign_id = data.id;

                let { cmviews, cmclicks, cmcost, cmpops } = findBy(eleRes, campaign_id, 'campaign_id');

                let ctr = Math.round((cmclicks / cmviews) * 10000) / 100 || 0;
                let tcost = cmcost.toFixed(2);

                byElements[campaign_id] = {
                    title: data.campaign_title,
                    views: cmviews,
                    clicks: cmclicks,
                    ctr: ctr,
                    pops: cmpops,
                    cost: tcost
                };
            });
        }
        if(reportType == 'publisher') {
            elements.forEach(data => {
                let site_id = data.id;

                let { wviews, wclicks, wcost, wpops } = findBy(eleRes, site_id, 'site_id');

                let ctr = Math.round((wclicks / wviews) * 10000) / 100 || 0;
                let tcost = wcost.toFixed(2);

                byElements[site_id] = {
                    domain: data.domain,
                    views: wviews,
                    clicks: wclicks,
                    ctr: ctr,
                    pops: wpops,
                    cost: tcost
                };
            });
        }


        // By device 1 desktop 2 phone 3 tablet
        const byDevice = {};
        const device_list = App_Settings.devices;
        for(key in device_list) {
            let device_name = device_list[key];
            
            let { dviews, dclicks, dcost, dpops } = findBy(deviceRes, key, 'device');

            let ctr = Math.round((dclicks / dviews) * 10000) / 100 || 0;
            let tcost = dcost.toFixed(2);

            byDevice[device_name] = {
                views: dviews,
                clicks: dclicks,
                ctr: ctr,
                pops: dpops,
                cost: tcost
            };
        }

        // By Os
        const byOs = {};
        const os_list = App_Settings.os;
        for(let key in os_list) {
            let os_name = os_list[key][0] + ' ' + os_list[key][1];
            
            let { osviews, osclicks, oscost, ospops } = findBy(osRes, key, 'os');

            let ctr = Math.round((osclicks / osviews) * 10000) / 100 || 0;
            let tcost = oscost.toFixed(2);

            byOs[os_name] = {
                views: osviews,
                clicks: osclicks,
                ctr: ctr,
                pops: ospops,
                cost: tcost
            };
        }

        // By Browser
        const byBrowser = {};
        const browser_list = App_Settings.browsers; 
        for(let key in browser_list) {
            let browser_name = browser_list[key];
            
            let { bviews, bclicks, bcost, bpops } = findBy(browserRes, key, 'browser');

            let ctr = Math.round((bclicks / bviews) * 10000) / 100 || 0;
            let tcost = bcost.toFixed(2);

            byBrowser[browser_name] = {
                views: bviews,
                clicks: bclicks,
                ctr: ctr,
                pops: bpops,
                cost: tcost
            };
        }

        // Return
        return {
            views_clicks: views_clicks,
            by_country: byCountry,
            by_elements: byElements,
            by_device: byDevice,
            by_os: byOs,
            by_browser: byBrowser
        };

    } catch (err) {
        if(!err.statusCode)
            err.statusCode = 500;
        throw err;
    }
}

const findBy = (arr, s, key) => {
    for(let i = 0;i < arr.length;i++) {
        if(arr[i][key] == s) {
            return arr[i];
        }
    }

    return {
        cmviews: 0, cmpops: 0, cmcost: 0, cmclicks: 0,
        wviews: 0, wpops: 0, wcost: 0, wclicks: 0,
        dviews: 0, dpops: 0, dcost: 0, dclicks: 0,
        osviews: 0, ospops:0, oscost: 0, osclicks: 0,
        bviews: 0, bpops:0, bcost: 0, bclicks: 0,
    }
}