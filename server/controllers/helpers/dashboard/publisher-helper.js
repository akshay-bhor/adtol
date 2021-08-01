const User = require("../../../models/users");
const { executeAllQueries } = require('../../../common/util');
const { App_Settings } = require('../../../common/settings');

exports.publisherHelper = async(req) => {  
    if(!req.userInfo) {
        const err = new Error('Not Allowed!');
        err.statusCode = 401;
        throw err;
    }

    try {
        // Userid
        const userid = req.userInfo.id;

        // Get total publisher views clicks spent and pops
        const userRes = await User.findOne({ where: { id: userid }, attributes: ['pub_earnings', 'pub_balance', 'pub_views', 'pub_clicks', 'pub_pops'] });
        
        // Last 7 days
        const today = new Date('2021-02-26').toISOString().slice(0, 10);
        const today_unix = Math.floor(new Date(today).getTime() / 1000);
        const week_before_unix = (today_unix - (60*60*24*7)); 

        const queries = [
            { "name": "views", "query": "SELECT COUNT(id) as views, day_unix FROM views WHERE pub_uid = "+ userid +" AND day_unix > "+ week_before_unix +" GROUP BY day_unix ORDER BY day_unix DESC"},
            { "name": "clicks", "query": "SELECT COUNT(id) as clicks, day_unix FROM clicks WHERE pub_uid = "+ userid +" AND day_unix > "+ week_before_unix +" GROUP BY day_unix ORDER BY day_unix DESC" },

            { "name": "countryviews", "query": "SELECT COUNT(id) as cviews, country FROM views WHERE pub_uid = "+ userid +" AND day_unix > "+ week_before_unix +" GROUP BY country" },
            { "name": "countrypops", "query": "SELECT COUNT(id) as cpops, SUM(pub_cpc) as cpopearned, country FROM pops WHERE pub_uid = "+ userid +" AND day_unix > "+ week_before_unix +" GROUP BY country" },
            { "name": "countryclicks", "query": "SELECT COUNT(id) as cclicks, SUM(pub_cpc) as cearned, country FROM clicks WHERE pub_uid = "+ userid +" AND day_unix > "+  week_before_unix +" GROUP BY country" },
            
            { "name": "webviews", "query": "SELECT COUNT(id) as wviews, site_id FROM views WHERE pub_uid = "+ userid +" AND day_unix >= "+ week_before_unix +" GROUP BY site_id" },
            { "name": "webpops", "query": "SELECT COUNT(id) as wpops, SUM(pub_cpc) as wpopearned, site_id FROM pops WHERE pub_uid = "+ userid +" AND day_unix > "+ week_before_unix +" GROUP BY site_id" },
            { "name": "webclicks", "query": "SELECT COUNT(id) as wclicks, SUM(pub_cpc) as wearned, site_id FROM clicks WHERE pub_uid = "+ userid +" AND day_unix > "+  week_before_unix +" GROUP BY site_id" },
            { "name": "websites", "query": "SELECT id, domain FROM pub_sites WHERE uid = "+ userid +" AND status = 1" }
        ];

        const result = await executeAllQueries(queries);
        const viewRes = result[0]; 
        const clickRes = result[1];
        const countryViews = result[2];
        const countryPops = result[3];
        const countryClicks = result[4];
        const webViews = result[5]; 
        const webPops = result[6];
        const webClicks = result[7]; 
        const websites = result[8];

        // Views and Clicks by date
        const views_clicks = {};
        let days_limit = 7;
        let ci = 0;
        let cj = 0;
        for(let i = 0;i < days_limit;i++) {

            let minus_unix = 0;
            if(i != 0) minus_unix = (60*60*24*i);

            if(clickRes[ci] && clickRes[ci].day_unix == (today_unix - minus_unix)) {
                let date = new Date((clickRes[ci].day_unix * 1000)).toISOString();
                date = date.slice(0, 10); 

                if(!views_clicks[date]) views_clicks[date] = {};

                views_clicks[date].clicks = clickRes[ci].clicks;
                if(!views_clicks[date].views) views_clicks[date].views = 0;
                ci++;
            }
            else {
                let date = new Date((today_unix - minus_unix) * 1000).toISOString();
                date = date.slice(0, 10); 

                if(!views_clicks[date]) views_clicks[date] = {};

                views_clicks[date].clicks = 0;
                if(!views_clicks[date].views) views_clicks[date].views = 0;
            }
            if(viewRes[cj] && viewRes[cj].day_unix == (today_unix - minus_unix)) {
                let date = new Date((viewRes[cj].day_unix * 1000)).toISOString();
                date = date.slice(0, 10);

                if(!views_clicks[date]) views_clicks[date] = {};

                views_clicks[date].views = viewRes[cj].views;
                if(!views_clicks[date].clicks) views_clicks[date].clicks = 0;
                cj++;
            }
            else {
                let date = new Date((today_unix - minus_unix) * 1000).toISOString();
                date = date.slice(0, 10);

                if(!views_clicks[date]) views_clicks[date] = {};

                views_clicks[date].views = 0;
                if(!views_clicks[date].clicks) views_clicks[date].clicks = 0;
            }
            
        }

        // Views pops and clicks by country
        i = 0;
        const byCountry = {};
        while(true) {
            if(!countryClicks[i] && !countryViews[i] && !countryPops[i]) break;

            if(countryClicks[i]) {
                let code = countryClicks[i].country;
                let cname = App_Settings.countries[code] ? App_Settings.countries[code][1] : 'Unknown';

                if(!byCountry[cname]) byCountry[cname] = {};

                byCountry[cname].clicks = countryClicks[i].cclicks;
                if(!byCountry[cname].earned)
                    byCountry[cname].earned = countryClicks[i].cearned;
                else    
                    byCountry[cname].earned += countryClicks[i].cearned;
                if(!byCountry[cname].views)
                    byCountry[cname].views = 0;
                if(!byCountry[cname].pops)
                    byCountry[cname].pops = 0;
            }
            if(countryViews[i]) {
                let code = countryViews[i].country;
                let cname = App_Settings.countries[code] ? App_Settings.countries[code][1] : 'Unknown';

                if(!byCountry[cname]) byCountry[cname] = {};

                byCountry[cname].views = countryViews[i].cviews;
                if(!byCountry[cname].earned)
                    byCountry[cname].earned = 0;
                if(!byCountry[cname].pops)
                    byCountry[cname].pops = 0;
                if(!byCountry[cname].clicks)
                    byCountry[cname].clicks = 0;
            }
            if(countryPops[i]) {
                let code = countryPops[i].country;
                let cname = App_Settings.countries[code] ? App_Settings.countries[code][1] : 'Unknown';

                if(!byCountry[cname]) byCountry[cname] = {};

                byCountry[cname].pops = countryPops[i].cpops;
                if(!byCountry[cname].earned)
                    byCountry[cname].earned = countryPops[i].cpopearned;
                else    
                    byCountry[cname].earned += countryPops[i].cpopearned;
                if(!byCountry[cname].views)
                    byCountry[cname].views = 0;
                if(!byCountry[cname].clicks)
                    byCountry[cname].clicks = 0;
            }

            i++;
        }


        // By websites
        const byWebsites = {};
        websites.forEach(data => {
            let site_id = data.id;

            let { wviews } = findBy(webViews, site_id, 'site_id');
            let { wclicks, wearned } = findBy(webClicks, site_id, 'site_id');
            let { wpops, wpopearned } = findBy(webPops, site_id, 'site_id');

            let ctr = Math.round((wclicks / wviews) * 10000) / 100;
            let tearned = Math.floor((wearned + wpopearned) * 100) / 100;

            byWebsites[site_id] = {
                url: data.domain,
                views: wviews,
                clicks: wclicks,
                ctr: ctr,
                pops: wpops,
                earned: tearned
            };
        });

        /**
         * Response
         */
        const total = {};
        total.pub_earning = userRes.dataValues.pub_earnings;
        total.pub_balance = userRes.dataValues.pub_balance;
        total.pub_views = userRes.dataValues.pub_views;
        total.pub_clicks = userRes.dataValues.pub_clicks;
        total.pub_pops = userRes.dataValues.pub_pops;

        // Return
        return {
            total: total,
            views_clicks: views_clicks,
            by_country: byCountry,
            by_websites: byWebsites
        };

    } catch(err) {
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
        wviews: 0, wpops: 0, wpopearned: 0, wclicks: 0, wearned: 0
    }
}