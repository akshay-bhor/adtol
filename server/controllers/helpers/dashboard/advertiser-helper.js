const User = require("../../../models/users");
const { App_Settings } = require('../../../common/settings');
const { executeAllQueries } = require('../../../common/util');

exports.advertiserHelper = async(req) => {  
    if(!req.userInfo) {
        const err = new Error('Not Allowed!');
        err.statusCode = 401;
        throw err;
    }

    try {
        // Userid
        const userid = req.userInfo.id;

        // Get total advertiser views clicks spent and pops
        const userRes = await User.findOne({ where: { id: userid }, attributes: ['ad_spending', 'ad_balance', 'ad_views', 'ad_clicks', 'ad_pops'] });
        
        // Last 7 days
        const today = new Date('2021-02-26').toISOString().slice(0, 10);
        const today_unix = Math.floor(new Date(today).getTime() / 1000);
        const week_before_unix = (today_unix - (60*60*24*7)); 

        const queries = [
            { "name": "views", "query": "SELECT COUNT(id) as views, day_unix FROM views WHERE ad_uid = "+ userid +" AND day_unix > "+ week_before_unix +" GROUP BY day_unix ORDER BY day_unix DESC"},
            { "name": "clicks", "query": "SELECT COUNT(id) as clicks, day_unix FROM clicks WHERE ad_uid = "+ userid +" AND day_unix > "+ week_before_unix +" GROUP BY day_unix ORDER BY day_unix DESC" },

            { "name": "countryviews", "query": "SELECT COUNT(id) as cviews, country FROM views WHERE ad_uid = "+ userid +" AND day_unix > "+ week_before_unix +" GROUP BY country" },
            { "name": "countrypops", "query": "SELECT COUNT(id) as cpops, SUM(ad_cpc) as cpopspent, country FROM pops WHERE ad_uid = "+ userid +" AND day_unix > "+ week_before_unix +" GROUP BY country" },
            { "name": "countryclicks", "query": "SELECT COUNT(id) as cclicks, SUM(ad_cpc) as cspent, country FROM clicks WHERE ad_uid = "+ userid +" AND day_unix > "+  week_before_unix +" GROUP BY country" },
            
            { "name": "campviews", "query": "SELECT COUNT(id) as cmviews, campaign_id FROM views WHERE ad_uid = "+ userid +" AND day_unix >= "+ week_before_unix +" GROUP BY campaign_id" },
            { "name": "camppops", "query": "SELECT COUNT(id) as cmpops, SUM(ad_cpc) as cmpopspent, campaign_id FROM pops WHERE ad_uid = "+ userid +" AND day_unix > "+ week_before_unix +" GROUP BY campaign_id" },
            { "name": "campclicks", "query": "SELECT COUNT(id) as cmclicks, SUM(ad_cpc) as cmspent, campaign_id FROM clicks WHERE ad_uid = "+ userid +" AND day_unix > "+  week_before_unix +" GROUP BY campaign_id" },
            { "name": "campaigns", "query": "SELECT id, campaign_title FROM campaigns WHERE uid = "+ userid +" AND status = 1" }
        ];

        const result = await executeAllQueries(queries);
        const viewRes = result[0]; 
        const clickRes = result[1];
        const countryViews = result[2];
        const countryPops = result[3];
        const countryClicks = result[4];
        const campViews = result[5]; 
        const campPops = result[6];
        const campClicks = result[7];
        const campaigns = result[8];

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
                if(!byCountry[cname].spent)
                    byCountry[cname].spent = countryClicks[i].cspent;
                else    
                    byCountry[cname].spent += countryClicks[i].cspent;
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
                if(!byCountry[cname].spent)
                    byCountry[cname].spent = 0;
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
                if(!byCountry[cname].spent)
                    byCountry[cname].spent = countryPops[i].cpopspent;
                else    
                    byCountry[cname].spent += countryPops[i].cpopspent;
                if(!byCountry[cname].views)
                    byCountry[cname].views = 0;
                if(!byCountry[cname].clicks)
                    byCountry[cname].clicks = 0;
            }

            i++;
        }


        // By campaign
        const byCampaign = {};
        campaigns.forEach(data => {
            let campaign_id = data.id;

            let { cmviews } = findBy(campViews, campaign_id, 'campaign_id');
            let { cmclicks, cmspent } = findBy(campClicks, campaign_id, 'campaign_id');
            let { cmpops, cmpopspent } = findBy(campPops, campaign_id, 'campaign_id');

            let ctr = Math.round((cmclicks / cmviews) * 10000) / 100;
            let tspent = (cmspent + cmpopspent);

            byCampaign[campaign_id] = {
                title: data.campaign_title,
                views: cmviews,
                clicks: cmclicks,
                ctr: ctr,
                pops: cmpops,
                spent: tspent
            };
        });

        /**
         * Response
         */
        const total = {};
        total.ad_spending = userRes.dataValues.ad_spending;
        total.ad_balance = userRes.dataValues.ad_balance;
        total.ad_views = userRes.dataValues.ad_views;
        total.ad_clicks = userRes.dataValues.ad_clicks;
        total.ad_pops = userRes.dataValues.ad_pops;

        
        // Return
        return {
            total: total,
            views_clicks: views_clicks,
            by_country: byCountry,
            by_campaign: byCampaign
        };
       

    } catch(err) {
        if(!err.statusCode)
            err.statusCode = 500;
        throw err;
    }
}

findBy = (arr, s, key) => {
    for(let i = 0;i < arr.length;i++) {
        if(arr[i][key] == s) {
            return arr[i];
        }
    }

    return {
        cmviews: 0, cmpops: 0, cmpopspent: 0, cmclicks: 0, cmclicks: 0, cmspent: 0
    }
}