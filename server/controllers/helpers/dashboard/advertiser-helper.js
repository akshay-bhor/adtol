//const User = require("../../../models/users");
const User = require('../../../models/users');
const Campaigns = require('../../../models/campaigns');
const Summary_device = require('../../../models/summary_device');
const Summary_country = require('../../../models/summary_country');
const { App_Settings } = require('../../../common/settings');
const { executeAllQueries } = require('../../../common/util');
const ObjectId = require('mongoose').Types.ObjectId;

exports.advertiserHelper = async(req) => {
    if(!req.userInfo) {
        const err = new Error('Not Allowed!');
        err.statusCode = 401;
        throw err;
    }

    try {
        // Userid
        const userid = req.userInfo._id;

        // Get total advertiser views clicks spent and pops
        //const userRes = await User.findOne({ where: { id: userid }, attributes: ['ad_spending', 'ad_balance', 'ad_views', 'ad_clicks', 'ad_pops'] });
        const userRes = await User.findOne( { _id: userid },
          {
              'ad_spending':1, 'ad_balance':1, 'ad_views':1, 'ad_clicks':1, 'ad_pops':1
          } );

        // Last 7 days
        const today = new Date().toISOString().slice(0, 10);
        const today_unix = Math.floor(new Date(today).getTime() / 1000);
        const week_before_unix = (today_unix - (60*60*24*7));

        // const queries = [
        //     { "name": "stats", "query": "SELECT SUM(views) as views, SUM(clicks) as clicks, SUM(pops) as pops, SUM(cost) as cost, day_unix FROM summary_device WHERE ad_uid=" + userid +" AND day_unix >= "+ week_before_unix +" GROUP BY day_unix ORDER BY day_unix DESC" },
        //     { "name": "countrystats", "query": "SELECT SUM(views) as cviews, SUM(clicks) as cclicks, SUM(pops) as cpops, SUM(cost) as cspent, country FROM summary_country WHERE ad_uid = "+ userid +" AND day_unix >= "+ week_before_unix +" GROUP BY country" },
        //     { "name": "campstats", "query": "SELECT SUM(views) as cmviews, SUM(pops) as cmpops, SUM(clicks) as cmclicks, SUM(cost) as cmspent, campaign as campaign_id from summary_device WHERE ad_uid = "+ userid +" AND day_unix >= "+ week_before_unix +" GROUP BY campaign" },
        //
        //     { "name": "campaigns", "query": "SELECT id, campaign_title FROM campaigns WHERE uid = "+ userid +" AND status = 1" }
        // ];


        const statRes = await Summary_device.aggregate([{
            $match: {"$and":[{ad_uid: new ObjectId(userid)},{day_unix:{$gte:week_before_unix}}]}
        },
            {
                $group:{
                    views: {$sum:"$views"},
                    clicks:{$sum:"$clicks"},
                    pops:{$sum:"$pops"},
                    cost:{$sum:"$cost"},

                    _id:"$day_unix"
                }},
            {$sort:{
                    _id:-1
                }
            }
        ]);

        const countryRes = await Summary_country.aggregate([{
            $match: {"$and": [{ad_uid: new ObjectId(userid)}, {day_unix:{$gte:week_before_unix}}]}
        },
            {
                $group: {
                    cviews: {$sum: "$views"},
                    cclicks: {$sum: "$clicks"},
                    cpops: {$sum: "$pops"},
                    cspent: {$sum: "$cost"},
                    _id: "$country",
                }
            },

        ]);

        const campRes = await Summary_device.aggregate([{
            $match: {"$and":[{ad_uid: new ObjectId(userid)},{day_unix:{$gte:week_before_unix}}]}
        },
            {
                $group:{
                    cmviews: {$sum:"$views"},
                    cmclicks:{$sum:"$clicks"},
                    cmpops:{$sum:"$pops"},
                    cmspent:{$sum:"$cost"},
                    _id: "$campaign",
                }}
        ]);

        const campaigns = await Campaigns.find({uid:new ObjectId(userid),status:1},{campaign_title:1});

        // const result = await executeAllQueries(queries);
        // const statRes = result[0];
        // const countryRes = result[1];
        // const campRes = result[2];
        // const campaigns = result[3];

        // Views and Clicks by date
        const views_clicks = {};
        let days_limit = 7;
        let ci = 0;
        let cj = 0;
        for(let i = 0;i < days_limit;i++) {

            let minus_unix = 0;
            if(i != 0) minus_unix = (60*60*24*i);

            if(statRes[ci] && statRes[ci]._id == (today_unix - minus_unix)) {
                let date = new Date((statRes[ci]._id * 1000)).toISOString();
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
                let code = countryRes[i]._id;
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
            let campaign_id = data._id;

            let { cmviews, cmclicks, cmpops, cmspent } = findBy(campRes, campaign_id, '_id');
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
        total.ad_spending = userRes.ad_spending;
        total.ad_balance = userRes.ad_balance;
        total.ad_views = userRes.ad_views;
        total.ad_clicks = userRes.ad_clicks;
        total.ad_pops = userRes.ad_pops;

        console.log({
            total: total,
            views_clicks: views_clicks,
            by_country: byCountry,
            by_campaign: byCampaign
        })

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
