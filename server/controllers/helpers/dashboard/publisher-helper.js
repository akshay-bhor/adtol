const User = require("../../../models/users");
const Summary_device = require('../../../models/summary_device');
const Summary_country = require('../../../models/summary_country');
const Publisher_sites = require('../../../models/publisher_sites');
const ObjectId = require('mongoose').Types.ObjectId;
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
        const userid = req.userInfo._id;

        // Get total publisher views clicks spent and pops
        const userRes = await User.findOne({ _id: userid }, {
            'pub_earnings':1,
            'pub_balance':1,
            'pub_views':1,
            'pub_clicks':1,
            'pub_pops':1
        });

        // Last 7 days
        const today = new Date().toISOString().slice(0, 10);
        const today_unix = Math.floor(new Date(today).getTime() / 1000);
        const week_before_unix = (today_unix - (60*60*24*7));

        // const queries = [
        //     { "name": "stats", "query": "SELECT SUM(views) as views, SUM(clicks) as clicks, SUM(pops) as pops, SUM(cost) as cost, day_unix FROM summary_device WHERE pub_uid=" + userid +" AND day_unix >= "+ week_before_unix +" GROUP BY day_unix ORDER BY day_unix DESC" },
        //     { "name": "countrystats", "query": "SELECT SUM(views) as cviews, SUM(clicks) as cclicks, SUM(pops) as cpops, SUM(cost) as cearned, country FROM summary_country WHERE pub_uid = "+ userid +" AND day_unix >= "+ week_before_unix +" GROUP BY country" },
        //     { "name": "webstats", "query": "SELECT SUM(views) as wviews, SUM(pops) as wpops, SUM(clicks) as wclicks, SUM(cost) as wearned, website as site_id from summary_device WHERE pub_uid = "+ userid +" AND day_unix >= "+ week_before_unix +" GROUP BY website" },
        //
        //     { "name": "websites", "query": "SELECT id, domain FROM pub_sites WHERE uid = "+ userid +" AND status = 1" }
        // ];

        const statRes = await Summary_device.aggregate([
            {
                $match: {"$and":[{pub_uid: new ObjectId(userid)},{day_unix:{$gte:week_before_unix}}]}
            },
            {
                $group:{
                    _id: "$day_unix",
                    views: {$sum:"$views"},
                    clicks:{$sum:"$clicks"},
                    pops:{$sum:"$pops"},
                    cost:{$sum:"$cost"},
                }
            },
            {
                $sort:{
                    _id:-1
                }
            }
        ]);

        const countryRes = await Summary_country.aggregate([
            {
                $match: {"$and":[{pub_uid: new ObjectId(userid)},{day_unix:{$gte:week_before_unix}}]}
            },
            {
                $group: {
                    cviews: {$sum: "$views"},
                    cclicks: {$sum: "$clicks"},
                    cpops: {$sum: "$pops"},
                    cearned: {$sum: "$cost"},
                    _id: "$country",
                }
            },
            {
                $sort: {
                    cearned: -1
                }
            },
            {$limit: 5}
        ]);

        const webRes = await Summary_device.aggregate([
            {
                $match: {"$and":[{pub_uid: new ObjectId(userid)},{day_unix:{$gte:week_before_unix}}]}
            },
            {
                $group:{
                    wviews: {$sum:"$views"},
                    wclicks:{$sum:"$clicks"},
                    wpops:{$sum:"$pops"},
                    wearned:{$sum:"$cost"},
                    _id:"$website"
                }},
        ]);

        const websites = await Publisher_sites.find({uid: new ObjectId(userid)}, {domain:1})

        // const result = await executeAllQueries(queries);
        // const statRes = result[0];
        // const countryRes = result[1];
        // const webRes = result[2];
        // const websites = result[3];

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
                byCountry[cname].earned = countryRes[i].cearned || 0;
                byCountry[cname].views = countryRes[i].cviews || 0;
                byCountry[cname].pops = countryRes[i].cpops || 0;
            }
            i++;
        }


        // By websites
        const byWebsites = {};
        websites.forEach(data => {
            let site_id = data._id;

            let { wviews, wclicks, wearned, wpops } = findBy(webRes, site_id, '_id');
            let ctr = Math.round((wclicks / wviews) * 10000) / 100;
            let tearned = Math.floor(wearned * 100) / 100;

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
        total.pub_earning = userRes.pub_earnings;
        total.pub_balance = userRes.pub_balance;
        total.pub_views = userRes.pub_views;
        total.pub_clicks = userRes.pub_clicks;
        total.pub_pops = userRes.pub_pops;

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
