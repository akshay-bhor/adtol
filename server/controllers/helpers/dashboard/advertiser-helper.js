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
            { "name": "stats", "query": "SELECT SUM(views) as views, SUM(clicks) as clicks, SUM(pops) as pops, SUM(ad_cost) as cost, day_unix FROM summary_device WHERE ad_uid=" + userid +" AND day_unix >= "+ week_before_unix +" GROUP BY day_unix ORDER BY day_unix DESC" },
            { "name": "countrystats", "query": "SELECT SUM(views) as cviews, SUM(clicks) as cclicks, SUM(pops) as cpops, SUM(ad_cost) as cspent, country FROM summary_country WHERE ad_uid = "+ userid +" AND day_unix >= "+ week_before_unix +" GROUP BY country" },
            { "name": "campstats", "query": "SELECT SUM(views) as cmviews, SUM(pops) as cmpops, SUM(clicks) as cmclicks, SUM(ad_cost) as cmspent, campaign as campaign_id from summary_device WHERE ad_uid = "+ userid +" AND day_unix >= "+ week_before_unix +" GROUP BY campaign" },

            { "name": "campaigns", "query": "SELECT id, campaign_title FROM campaigns WHERE uid = "+ userid +" AND status = 1" }
        ];

        const result = await executeAllQueries(queries);
        const statRes = result[0];
        const countryRes = result[1];
        const campRes = result[2];
        const campaigns = result[3];

        // Views and Clicks by date
        const views_clicks = {};
        let days_limit = 7;
        let ci = 0;
        let cj = 0;
        for(let i = 0;i < days_limit;i++) {

            let minus_unix = 0;
            if(i != 0) minus_unix = (60*60*24*i);

            if(statRes[ci] && statRes[ci].day_unix == (today_unix - minus_unix)) {
                let date = new Date((statRes[ci].day_unix * 1000)).toISOString();
                date = date.slice(0, 10); 

                if(!views_clicks[date]) views_clicks[date] = {};

                views_clicks[date].clicks = statRes[ci].clicks || 0;
                views_clicks[date].views = statRes[ci].views || 0;
                views_clicks[date].pops = statRes[ci].pops || 0;
                ci++;
            }
            else {
                let date = new Date((today_unix - minus_unix) * 1000).toISOString();
                date = date.slice(0, 10); 

                if(!views_clicks[date]) views_clicks[date] = {};

                views_clicks[date].clicks = 0;
                views_clicks[date].views = 0;
                views_clicks[date].pops = 0;
            }
        }

        // Views pops and clicks by country
        i = 0;
        const byCountry = {};
        while(true) {
            if(!countryRes[i]) break;

            if(countryRes[i]) {
                let code = countryRes[i].country; 
                let cname = App_Settings.countries[code] ? App_Settings.countries[code][1] : 'Unknown';

                if(!byCountry[cname]) byCountry[cname] = {};

                byCountry[cname].clicks = countryRes[i].cclicks || 0;
                byCountry[cname].spent = countryRes[i].cspent || 0;
                byCountry[cname].views = countryRes[i].cviews || 0;
                byCountry[cname].pops = countryRes[i].cpops || 0;
            }

            i++;
        }


        // By campaign
        const byCampaign = {};
        campaigns.forEach(data => {
            let campaign_id = data.id;

            let { cmviews, cmclicks, cmpops, cmspent } = findBy(campRes, campaign_id, 'campaign_id');
            let ctr = Math.round((cmclicks / cmviews) * 10000) / 100;
            let tspent = Math.floor(cmspent * 100) / 100;

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

const findBy = (arr, s, key) => { 
    for(let i = 0;i < arr.length;i++) {
        if(arr[i][key] == s) {
            return arr[i];
        }
    }
   
    return {
        cmviews: 0, cmpops: 0, cmpopspent: 0, cmclicks: 0, cmclicks: 0, cmspent: 0
    }
}