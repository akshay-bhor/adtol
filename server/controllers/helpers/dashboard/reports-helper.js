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
                cond = 'ad_uid = '+ userid +' AND day_unix >= '+ tunix +' AND campaign_id = '+ campId;
            else
                cond = 'ad_uid = '+ userid +' AND day_unix >= '+ tunix;
        }
        if(reportType == 'publisher') {
            if(webId != 0)
                cond = 'pub_uid = '+ userid +' AND day_unix >= '+ tunix +' AND site_id = '+ webId;
            else
                cond = 'pub_uid = '+ userid +' AND day_unix >= '+ tunix;
        }
        // cpc col
        let col;
        if(reportType == 'advertiser') col = 'ad_cpc';
        if(reportType == 'publisher') col = 'pub_cpc';

        const queries = [
            { "name": "views", "query": "SELECT COUNT(id) as views, day_unix FROM views WHERE "+ cond +" GROUP BY day_unix ORDER BY day_unix DESC" },
            { "name": "clicks", "query": "SELECT COUNT(id) as clicks, SUM("+ col +") as ccost, day_unix FROM clicks WHERE "+ cond +" GROUP BY day_unix ORDER BY day_unix DESC" },
            { "name": "pops", "query": "SELECT COUNT(id) as pops, SUM("+ col +") as pcost, day_unix FROM pops WHERE "+ cond +" GROUP BY day_unix ORDER BY day_unix DESC" },

            { "name": "countryviews", "query": "SELECT COUNT(id) as cviews, country FROM views WHERE "+ cond +" GROUP BY country" },
            { "name": "countryclicks", "query": "SELECT COUNT(id) as cclicks, SUM("+ col +") as cccost, country FROM clicks WHERE "+ cond +" GROUP BY country" },
            { "name": "countrypops", "query": "SELECT COUNT(id) as cpops, SUM("+ col +") as cpcost, country FROM pops WHERE "+ cond +" GROUP BY country" },

            { "name": "deviceviews", "query": "SELECT COUNT(id) as dviews, device FROM views WHERE "+ cond +" GROUP BY device" },
            { "name": "deviceclicks", "query": "SELECT COUNT(id) as dclicks, SUM("+ col +") as dccost, device FROM clicks WHERE "+ cond +" GROUP BY device" },
            { "name": "devicepops", "query": "SELECT COUNT(id) as dpops, SUM("+ col +") as dpcost, device FROM pops WHERE "+ cond +" GROUP BY device" },

            { "name": "osviews", "query": "SELECT COUNT(id) as osviews, os FROM views WHERE "+ cond +" GROUP BY os" },
            { "name": "osclicks", "query": "SELECT COUNT(id) as osclicks, SUM("+ col +") as osccost, os FROM clicks WHERE "+ cond +" GROUP BY os" },
            { "name": "ospops", "query": "SELECT COUNT(id) as ospops, SUM("+ col +") as ospcost, os FROM pops WHERE "+ cond +" GROUP BY os" },

            { "name": "bviews", "query": "SELECT COUNT(id) as bviews, browser FROM views WHERE "+ cond +" GROUP BY browser" },
            { "name": "bclicks", "query": "SELECT COUNT(id) as bclicks, SUM("+ col +") as bccost, browser FROM clicks WHERE "+ cond +" GROUP BY browser" },
            { "name": "bpops", "query": "SELECT COUNT(id) as bpops, SUM("+ col +") as bpcost, browser FROM pops WHERE "+ cond +" GROUP BY browser" },
        ];

        // Append to query array according to report type
        if(reportType == 'advertiser') {
            queries.push(
                { "name": "campviews", "query": "SELECT COUNT(id) as cmviews, campaign_id FROM views WHERE "+ cond +" GROUP BY campaign_id" },
                { "name": "campclicks", "query": "SELECT COUNT(id) as cmclicks, SUM("+ col +") as cmccost, campaign_id FROM clicks WHERE "+ cond +" GROUP BY campaign_id" },
                { "name": "camppops", "query": "SELECT COUNT(id) as cmpops, SUM("+ col +") as cmpcost, campaign_id FROM pops WHERE "+ cond +" GROUP BY campaign_id" },
                { "name": "campaigns", "query": "SELECT id, campaign_title FROM campaigns WHERE uid = "+ userid +" AND status = 1" }
            );
        }
        if(reportType == 'publisher') {
            queries.push(
                { "name": "webviews", "query": "SELECT COUNT(id) as wviews, site_id FROM views WHERE "+ cond +" GROUP BY site_id" },
                { "name": "webclicks", "query": "SELECT COUNT(id) as wclicks, SUM("+ col +") as wccost, site_id FROM clicks WHERE "+ cond +" GROUP BY site_id" },
                { "name": "webpops", "query": "SELECT COUNT(id) as wpops, SUM("+ col +") as wpcost, site_id FROM pops WHERE "+ cond +" GROUP BY site_id" },
                { "name": "websites", "query": "SELECT id, domain FROM pub_sites WHERE uid = "+ userid +" AND status = 1" }
            );
        }



        const result = await executeAllQueries(queries);
        const viewRes = result[0];
        const clickRes = result[1]; 
        const popRes = result[2];
        const countryViews = result[3];
        const countryClicks = result[4];
        const countryPops = result[5];
        const devViews = result[6]; 
        const devClicks = result[7];
        const devPops = result[8];
        const osViews = result[9];
        const osClicks = result[10];
        const osPops = result[11];
        const bViews = result[12];
        const bClicks = result[13];
        const bPops = result[14]; 

        
        const eleViews = result[15];
        const eleClicks = result[16];
        const elePops = result[17];
        const elements = result[18];

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
        let cj = 0;
        let ck = 0;
        for(let i = 0;i < day_duration;i++) {

            let minus_unix = 0;
            if(i != 0) minus_unix = (60*60*24*i);

            if(clickRes[ci] && clickRes[ci].day_unix == (today_unix - minus_unix)) {
                let date = new Date((clickRes[ci].day_unix * 1000)).toISOString();
                date = date.slice(0, 10); 

                if(!views_clicks[date]) views_clicks[date] = {};

                views_clicks[date].clicks = clickRes[ci].clicks; 
                views_clicks[date].cost = (clickRes[ci].ccost + (views_clicks[date].cost || 0));
                if(!views_clicks[date].views) views_clicks[date].views = 0;
                if(!views_clicks[date].pops) views_clicks[date].pops = 0;
                ci++;
            }
            else {
                let date = new Date((today_unix - minus_unix) * 1000).toISOString();
                date = date.slice(0, 10); 

                if(!views_clicks[date]) views_clicks[date] = {};

                views_clicks[date].clicks = 0;
                views_clicks[date].cost += 0;
                if(!views_clicks[date].views) views_clicks[date].views = 0;
                if(!views_clicks[date].pops) views_clicks[date].pops = 0;
            }
            if(viewRes[cj] && viewRes[cj].day_unix == (today_unix - minus_unix)) {
                let date = new Date((viewRes[cj].day_unix * 1000)).toISOString();
                date = date.slice(0, 10);

                if(!views_clicks[date]) views_clicks[date] = {};

                views_clicks[date].views = viewRes[cj].views;
                if(!views_clicks[date].clicks) views_clicks[date].clicks = 0;
                if(!views_clicks[date].pops) views_clicks[date].pops = 0;
                if(!views_clicks[date].cost) views_clicks[date].cost = 0;
                cj++;
            }
            else {
                let date = new Date((today_unix - minus_unix) * 1000).toISOString();
                date = date.slice(0, 10);

                if(!views_clicks[date]) views_clicks[date] = {};

                views_clicks[date].views = 0;
                if(!views_clicks[date].clicks) views_clicks[date].clicks = 0;
                if(!views_clicks[date].pops) views_clicks[date].pops = 0;
                if(!views_clicks[date].cost) views_clicks[date].cost = 0;
            }
            if(popRes[ck] && popRes[ck].day_unix == (today_unix - minus_unix)) {
                let date = new Date((popRes[ck].day_unix * 1000)).toISOString();
                date = date.slice(0, 10);

                if(!views_clicks[date]) views_clicks[date] = {};

                views_clicks[date].pops = popRes[ck].pops;
                views_clicks[date].cost = (popRes[ck].pcost + (views_clicks[date].cost || 0));
                if(!views_clicks[date].clicks) views_clicks[date].clicks = 0;
                if(!views_clicks[date].views) views_clicks[date].views = 0;
                ck++;
            }
            else {
                let date = new Date((today_unix - minus_unix) * 1000).toISOString();
                date = date.slice(0, 10);

                if(!views_clicks[date]) views_clicks[date] = {};

                views_clicks[date].pops = 0;
                views_clicks[date].cost += 0;
                if(!views_clicks[date].clicks) views_clicks[date].clicks = 0;
                if(!views_clicks[date].views) views_clicks[date].views = 0;
            }
        }

        // Views pops and clicks by country
        i = 0;
        const byCountry = {};
        while(true) {
            if(!countryClicks[i] && !countryViews[i] && !countryPops[i]) break;

            if(countryClicks[i]) {
                let code = countryClicks[i].country;
                let cname = App_Settings.countries[code][1];

                if(!byCountry[cname]) byCountry[cname] = {};

                byCountry[cname].clicks = countryClicks[i].cclicks;
                if(!byCountry[cname].cost)
                    byCountry[cname].cost = countryClicks[i].cccost;
                else    
                    byCountry[cname].cost += countryClicks[i].cccost;
                if(!byCountry[cname].views)
                    byCountry[cname].views = 0;
                if(!byCountry[cname].pops)
                    byCountry[cname].pops = 0;
            }
            if(countryViews[i]) {
                let code = countryViews[i].country;
                let cname = App_Settings.countries[code][1];

                if(!byCountry[cname]) byCountry[cname] = {};

                byCountry[cname].views = countryViews[i].cviews;
                if(!byCountry[cname].cost)
                    byCountry[cname].cost = 0;
                if(!byCountry[cname].pops)
                    byCountry[cname].pops = 0;
                if(!byCountry[cname].clicks)
                    byCountry[cname].clicks = 0;
            }
            if(countryPops[i]) {
                let code = countryPops[i].country;
                let cname = App_Settings.countries[code][1];

                if(!byCountry[cname]) byCountry[cname] = {};

                byCountry[cname].pops = countryPops[i].cpops;
                if(!byCountry[cname].cost)
                    byCountry[cname].cost = countryPops[i].cpcost;
                else    
                    byCountry[cname].cost += countryPops[i].cpcost;
                if(!byCountry[cname].views)
                    byCountry[cname].views = 0;
                if(!byCountry[cname].clicks)
                    byCountry[cname].clicks = 0;
            }

            i++;
        }


        // By elements -> campaign for advertiser, websites for publishers
        const byElements = {};
        if(reportType == 'advertiser') {
            elements.forEach(data => {
                let campaign_id = data.id;

                let { cmviews } = findBy(eleViews, campaign_id, 'campaign_id');
                let { cmclicks, cmccost } = findBy(eleClicks, campaign_id, 'campaign_id');
                let { cmpops, cmpcost } = findBy(elePops, campaign_id, 'campaign_id');

                let ctr = Math.round((cmclicks / cmviews) * 10000) / 100 || 0;
                let tcost = (cmccost + cmpcost);

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

                let { wviews } = findBy(eleViews, site_id, 'site_id');
                let { wclicks, wccost } = findBy(eleClicks, site_id, 'site_id');
                let { wpops, wpcost } = findBy(elePops, site_id, 'site_id');

                let ctr = Math.round((wclicks / wviews) * 10000) / 100 || 0;
                let tcost = (wccost + wpcost);

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
            
            let { dviews } = findBy(devViews, key, 'device');
            let { dclicks, dccost } = findBy(devClicks, key, 'device');
            let { dpops, dpcost } = findBy(devPops, key, 'device');

            let ctr = Math.round((dclicks / dviews) * 10000) / 100 || 0;
            let tcost = (dccost + dpcost);

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
            
            let { osviews } = findBy(osViews, key, 'os');
            let { osclicks, osccost } = findBy(osClicks, key, 'os');
            let { ospops, ospcost } = findBy(osPops, key, 'os');

            let ctr = Math.round((osclicks / osviews) * 10000) / 100 || 0;
            let tcost = (osccost + ospcost);

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
            
            let { bviews } = findBy(bViews, key, 'browser');
            let { bclicks, bccost } = findBy(bClicks, key, 'browser');
            let { bpops, bpcost } = findBy(bPops, key, 'browser');

            let ctr = Math.round((bclicks / bviews) * 10000) / 100 || 0;
            let tcost = (bccost + bpcost);

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
        cmviews: 0, cmpops: 0, cmpcost: 0, cmclicks: 0, cmccost: 0,
        wviews: 0, wpops: 0, wpcost: 0, wclicks: 0, wccost: 0,
        dviews: 0, dpops: 0, dpcost: 0, dclicks: 0, dccost: 0,
        osviews: 0, ospops:0, ospcost: 0, osclicks: 0, osccost: 0,
        bviews: 0, bpops:0, bpcost: 0, bclicks: 0, bccost: 0
    }
}