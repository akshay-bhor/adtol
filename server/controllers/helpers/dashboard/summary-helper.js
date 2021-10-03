const { executeAllQueries } = require('../../../common/util');
const { App_Settings } = require('../../../common/settings');

exports.summaryHelper = async(req) => {
    if(!req.userInfo) {
        const err = new Error('Not Allowed!');
        err.statusCode = 401;
        throw err;
    }

    try {
        // Userid
        const userid = req.userInfo.id;
       
        // Todays Date in Unix
        let today = new Date().toISOString().slice(0, 10);
        let today_unix = Math.floor(new Date(today).getTime() / 1000);
        // Yesterday
        const yesterday_unix = today_unix - (60*60*24);
        
        // Date 60 days back
        let sixty_days_in_sec = (60 * 60 * 24 * 60);
        let past_date_unix = today_unix - sixty_days_in_sec;
        // 14 days back
        let two_weeks = (60*60*24*14);
        let past_two_weeks_unix = today_unix - two_weeks;

        const queries = [
            { "name": "stats", "query": "SELECT SUM(views) as views, SUM(clicks) as clicks, SUM(pops) as pops, SUM(cost) as earned, day_unix FROM summary_device WHERE pub_uid=" + userid +" AND day_unix >= "+ past_date_unix +" GROUP BY day_unix ORDER BY day_unix DESC" },
            { "name": "countrystats", "query": "SELECT views as cviews, clicks as cclicks, pops as cpops, cost as cearned, country FROM summary_country WHERE pub_uid = "+ userid +" AND day_unix = "+ today_unix +" ORDER BY cost DESC LIMIT 5" },
            { "name": "devices", "query": "SELECT SUM(views) as views, SUM(clicks) as clicks, SUM(pops) as pops, SUM(cost) as dearned, device FROM summary_device WHERE pub_uid=" + userid +" AND day_unix = "+ today_unix +" GROUP BY device" },
            
            { "name": "user", "query": "SELECT pub_balance, ad_balance FROM users WHERE id = "+ userid +"" },
            
            { "name": "stats", "query": "SELECT SUM(views) as ad_views, SUM(clicks) as ad_clicks, SUM(pops) as ad_pops, SUM(cost) as spent, day_unix FROM summary_device WHERE ad_uid=" + userid +" AND day_unix >= "+ past_date_unix +" GROUP BY day_unix ORDER BY day_unix DESC" },
            { "name": "countrystats", "query": "SELECT views as cviews, clicks as cclicks, pops as cpops, cost as cspent, country, day_unix FROM summary_country WHERE ad_uid = "+ userid +" AND day_unix = "+ today_unix +" ORDER BY cost DESC LIMIT 5" },
            { "name": "devices", "query": "SELECT SUM(views) as views, SUM(clicks) as clicks, SUM(pops) as pops, SUM(cost) as dspent, device FROM summary_device WHERE ad_uid =" + userid +" AND day_unix = "+ today_unix +" GROUP BY device" },
        ];

        const result = await executeAllQueries(queries);
        let pubRes = result[0];     
        let countryRes = result[1];   
        let devicesRes = result[2];

        let adRes = result[4];     
        let ad_countryRes = result[5];   
        let ad_deviceRes = result[6];
        
       
        // Get today earned
        let todayEarned = 0;

        // Yesterday vs same day last week
        let yesterdayEarned = 0;
        let vssamedaylastweek = 0;
        
        // last 7 days
        let earned7days = 0;
        let earnedprev7days = 0;

        // last 30 days
        let earned30days = 0;
        let earnedprev30days = 0;
        
        let i = 0;
        while(i < pubRes.length) {

            // Today
            if(pubRes[i].day_unix == today_unix) { 
                todayEarned += pubRes[i].earned || 0;
            }

            // Yesterday
            if(pubRes[i].day_unix == yesterday_unix) {
                yesterdayEarned += pubRes[i].earned || 0;
            }

            // Vssamedaylastweek
            if(pubRes[i].day_unix == (today_unix - (60*60*24*8))) {
                vssamedaylastweek += pubRes[i].earned || 0;;
            }
            
            // Last 7 days
            if(pubRes[i].day_unix >= (today_unix - (60*60*24*7))) { 
                earned7days += pubRes[i].earned || 0;
            }
            
            // Prev 7 days
            if(pubRes[i].day_unix >= (today_unix - (60*60*24*14)) && pubRes[i].day_unix < (today_unix - (60*60*24*7))) {     
                earnedprev7days += pubRes[i].earned || 0;
            }

            // Last 30 days
            if(pubRes[i].day_unix >= (today_unix - (60*60*24*30))) {
                earned30days += pubRes[i].earned || 0;
            }
            
            // Prev 30 days
            if(pubRes[i].day_unix >= (today_unix - (60*60*24*60)) && pubRes[i].day_unix < (today_unix - (60*60*24*30))) {
                earnedprev30days += pubRes[i].earned || 0;
            }
            i++;
        }

        // Performance
        let { views, pops, clicks } = findBy(pubRes, today_unix, 'day_unix');
        let cpc = 'NA';
        if(clicks != 0) cpc = (todayEarned / clicks).toFixed(2);

        // Publisher balance
        let pub_balance = result[3][0]['pub_balance'];
        
        // Countries
        let countryStats = {};
        countryRes.forEach(c => {
            // Find country Name
            let cid = c.country; 
            let [ccode, cname] = App_Settings.countries[cid];
            
            countryStats[cname] = {
                "earned": c.cearned.toFixed(2),
                "views": c.cviews,
                "clicks": c.cclicks,
                "pops": c.cpops
            };
        });

        // devices
        const devices = {};
        const all_devices = App_Settings.devices;
        for(let i = 1;i < Object.keys(all_devices).length;i++) {
            Object.keys(all_devices).forEach(key => { console.log(devicesRes);
                devices[all_devices[key]] = devicesRes.filter(data => +data.device === +key)[0] ||  
                    { 
                        views: 0, clicks: 0, pops: 0, earned: 0
                    };
            });
        }
        /**
         * Ad Pop
         * Mysql db search cost probably too high, paused for now
         */
        // let pop_earn_today = 0;
        // let pop_earn_yesterday = 0;
        // {
        //     let { pearned } = findBy(adunitspop, today_unix, 'day_unix');
        //     pop_earn_today += pearned;
        // }
        // {
        //     let { pearned } = findBy(adunitspop, yesterday_unix, 'day_unix');
        //     pop_earn_yesterday += pearned;
        // }
        // ad_units['pop'] = [pop_earn_today.toFixed(2), pop_earn_yesterday.toFixed(2)]; 

        // Response
        let pub_estimates = {};
        pub_estimates.todaySum = todayEarned.toFixed(2);
        pub_estimates.yesterdaySum = yesterdayEarned.toFixed(2);
        pub_estimates.vssamedaylastweek = vssamedaylastweek.toFixed(2);
        pub_estimates.sum7days = earned7days.toFixed(2);
        pub_estimates.sumprev7days = earnedprev7days.toFixed(2);
        pub_estimates.sum30days = earned30days.toFixed(2);
        pub_estimates.sumprev30days = earnedprev30days.toFixed(2);
        let performance = {};
        performance.impressions = views;
        performance.pops = pops;
        performance.clicks = clicks;
        performance.cpc = cpc;





        /**
         * Advertiser
         */

        // Get today spent
        let todaySpent = 0;

        // Yesterday vs same day last week
        let yesterdaySpent = 0;
        let ad_vssamedaylastweek = 0;
        
        // last 7 days
        let spent7days = 0;
        let spentprev7days = 0;

        // last 30 days
        let spent30days = 0;
        let spentprev30days = 0;

        i = 0;
        while(i < adRes.length) {

            // Today
            if(adRes[i].day_unix == today_unix) { 
                todaySpent += adRes[i].spent || 0;
            }
            
            // Yesterday
            if(adRes[i].day_unix == yesterday_unix) {
                yesterdaySpent += adRes[i].spent || 0;
            }
            
            // Vssamedaylastweek
            if(adRes[i].day_unix == (today_unix - (60*60*24*8))) { 
                ad_vssamedaylastweek += adRes[i].spent || 0;
            }
            
            // Last 7 days
            if(adRes[i].day_unix >= (today_unix - (60*60*24*7))) { 
                spent7days += adRes[i].spent || 0;
            }
            
            // Prev 7 days
            if(adRes[i].day_unix >= (today_unix - (60*60*24*14)) && adRes[i].day_unix < (today_unix - (60*60*24*7))) {
                spentprev7days += adRes[i].spent || 0;
            }
            
            // Last 30 days
            if(adRes[i].day_unix >= (today_unix - (60*60*24*30))) {
                spent30days += adRes[i].spent || 0;
            }
            
            // Prev 30 days
            if(adRes[i].day_unix >= (today_unix - (60*60*24*60)) && adRes[i].day_unix < (today_unix - (60*60*24*30))) {
                spentprev30days += adRes[i].spent || 0;
            }

            i++;
        }


        // Performance
        let { ad_views } = findBy(adRes, today_unix, 'day_unix');
        let { ad_pops } = findBy(adRes, today_unix, 'day_unix');
        let { ad_clicks } = findBy(adRes, today_unix, 'day_unix');
        let ad_cpc = 'NA';
        if(ad_clicks != 0) ad_cpc = (todaySpent / ad_clicks).toFixed(2);

        // Publisher balance
        let ad_balance = result[3][0]['ad_balance'];
        
        // Countries
        let ad_countryStats = {};
        ad_countryRes.forEach(c => {
            // Find country Name
            let cid = c.country; 
            let [ccode, cname] = App_Settings.countries[cid];
            
            ad_countryStats[cname] = {
                "spent": c.cspent.toFixed(2),
                "views": c.cviews,
                "clicks": c.cclicks,
                "pops": c.cpops
            };
        });

        // devices
        const ad_devices = {};
        for(let i = 1;i < Object.keys(all_devices).length;i++) {
            Object.keys(all_devices).forEach(key => {
                ad_devices[App_Settings.devices[key]] = ad_deviceRes.filter(data => +data.device === +key)[0] ||  
                { 
                    views: 0, clicks: 0, pops: 0, spent: 0
                };;
            });
        }
        // Ad pop
        // let pop_spent_today = 0;
        // let pop_spent_yesterday = 0;
        // {
        //     let { pspent } = findBy(ad_popRes, today_unix, 'day_unix');
        //     pop_spent_today += pspent;
        // }
        // {
        //     let { pspent } = findBy(ad_popRes, yesterday_unix, 'day_unix');
        //     pop_spent_yesterday += pspent;
        // }
        // ad_ad_units['pop'] = [pop_spent_today.toFixed(2), pop_spent_yesterday.toFixed(2)];

        // Response
        let ad_estimates = {};
        ad_estimates.todaySum = todaySpent.toFixed(2);
        ad_estimates.yesterdaySum = yesterdaySpent.toFixed(2);
        ad_estimates.vssamedaylastweek = ad_vssamedaylastweek.toFixed(2); 
        ad_estimates.sum7days = spent7days.toFixed(2);
        ad_estimates.sumprev7days = spentprev7days.toFixed(2);
        ad_estimates.sum30days = spent30days.toFixed(2);
        ad_estimates.sumprev30days = spentprev30days.toFixed(2);
        let ad_performance = {};
        ad_performance.impressions = ad_views;
        ad_performance.pops = ad_pops;
        ad_performance.clicks = ad_clicks;
        ad_performance.cpc = ad_cpc;

        // Return
        return {
            pub_estimates: pub_estimates,
            pub_performance: performance,
            pub_balance: pub_balance,
            ad_balance: ad_balance,
            pub_countries: countryStats,
            pub_ad_devices: devices,
            ad_estimates: ad_estimates,
            ad_performance: ad_performance,
            ad_countries: ad_countryStats,
            ad_ad_devices: ad_devices
        };

    } catch(err) {
        if(!err.statusCode)
            err.statusCode = 500
        throw err;
    }
}

const findBy = (arr, s, key, log = 0) => {
    
    if(log == 1) console.log(arr.length);
    for(let i = 0;i < arr.length;i++) {

        if(arr[i][key] == s) { 
            return arr[i];
        }
    }
    // arr.forEach(d => {
    //     if(d.day_unix == s) { 
    //         if(log == 1) { console.log(arr[i]); console.log(arr[i][key]); }
    //         re = d;
    //     }
    // });
    return { earned: 0, pearned: 0, cearned: 0, pops: 0, views:0, cviews: 0, clicks: 0, cclicks: 0, adearned: 0,
        spent: 0, pspent: 0, cspent: 0, ad_pops: 0, ad_views:0, ad_clicks: 0 };
}