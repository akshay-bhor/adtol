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
        // let today = new Date().toISOString().slice(0, 10);
        let today = '2021-02-25';
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
            { "name": "clicks", "query": "SELECT COUNT(id) as clicks, SUM(pub_cpc) as earned, day_unix FROM clicks WHERE pub_uid ="+ userid +" AND day_unix >= "+ past_date_unix +" GROUP BY day_unix ORDER BY day_unix DESC" },
            { "name": "pops", "query": "SELECT COUNT(id) as pops, SUM(pub_cpc) as pearned, day_unix FROM pops WHERE pub_uid ="+ userid +" AND day_unix >= "+ past_date_unix +" GROUP BY day_unix ORDER BY day_unix DESC" },
            { "name": "views", "query": "SELECT COUNT(id) as views, day_unix FROM views WHERE pub_uid ="+ userid +" AND day_unix >= "+ past_date_unix +" GROUP BY day_unix ORDER BY day_unix DESC" },
            { "name": "countyview", "query": "SELECT COUNT(id) as cviews, country FROM views WHERE pub_uid = "+ userid +" AND day_unix = "+ today_unix +" GROUP BY country ORDER BY COUNT(id) DESC" },
            { "name": "countryclicks", "query": "SELECT COUNT(id) as cclicks, SUM(pub_cpc) as cearned, country FROM clicks WHERE pub_uid = "+  userid +" AND day_unix = "+ today_unix +" GROUP BY country ORDER BY SUM(pub_cpc) DESC LIMIT 5" },
            { "name": "adunits", "query": "SELECT SUM(pub_cpc) as adearned, ad_type, day_unix FROM clicks WHERE pub_uid = "+ userid +" AND day_unix >= "+ yesterday_unix +" GROUP BY ad_type, day_unix" },
            { "name": "user", "query": "SELECT pub_balance, ad_balance FROM users WHERE id = "+ userid +"" },

            { "name": "clicks", "query": "SELECT COUNT(id) as ad_clicks, SUM(ad_cpc) as spent, day_unix FROM clicks WHERE ad_uid ="+ userid +" AND day_unix >= "+ past_date_unix +" GROUP BY day_unix ORDER BY day_unix DESC" },
            { "name": "pops", "query": "SELECT COUNT(id) as ad_pops, SUM(ad_cpc) as pspent, day_unix FROM pops WHERE ad_uid ="+ userid +" AND day_unix >= "+ past_date_unix +" GROUP BY day_unix ORDER BY day_unix DESC" },
            { "name": "views", "query": "SELECT COUNT(id) as ad_views, day_unix FROM views WHERE ad_uid ="+ userid +" AND day_unix >= "+ past_date_unix +" GROUP BY day_unix ORDER BY day_unix DESC" },
            { "name": "countyview", "query": "SELECT COUNT(id) as ad_cviews, country FROM views WHERE ad_uid = "+ userid +" AND day_unix = "+ today_unix +" GROUP BY country ORDER BY COUNT(id) DESC" },
            { "name": "countryclicks", "query": "SELECT COUNT(id) as ad_cclicks, SUM(ad_cpc) as cspent, country FROM clicks WHERE ad_uid = "+  userid +" AND day_unix = "+ today_unix +" GROUP BY country ORDER BY SUM(ad_cpc) DESC LIMIT 5" },
            { "name": "adunits", "query": "SELECT SUM(ad_cpc) as adspent, ad_type, day_unix FROM clicks WHERE ad_uid = "+ userid +" AND day_unix >= "+ yesterday_unix +" GROUP BY ad_type, day_unix" },
        ];

        const result = await executeAllQueries(queries);
        let clickRes = result[0];  
        let popRes = result[1];
        let viewRes = result[2]      
        let countryView = result[3];   
        let countryclicks = result[4]; 
        let adunits = result[5];

        let ad_clickRes = result[7];
        let ad_popRes = result[8];
        let ad_viewRes = result[9];
        let ad_countryView = result[10];
        let ad_countryClicks = result[11]; 
        let ad_adunits = result[12];
        
       
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
        while(true) {
            // Breask condition
            if(!clickRes[i] && !popRes[i]) break;

            // Today
            if(clickRes[i] && clickRes[i].day_unix == today_unix) { 
                let clickearn = clickRes[i].earned || 0;
                todayEarned += clickearn;
            }
            if(popRes[i] && popRes[i].day_unix == today_unix) {
                let popearn = popRes[i].pearned || 0;
                todayEarned += popearn;
            }
            // Yesterday
            if(clickRes[i] && clickRes[i].day_unix == yesterday_unix) {
                let clickearn = clickRes[i].earned || 0;
                yesterdayEarned += clickearn;
            }
            if(popRes[i] && popRes[i].day_unix == yesterday_unix) {
                let popearn = popRes[i].pearned || 0;
                yesterdayEarned += popearn;
            }
            // Vssamedaylastweek
            if(clickRes[i] && clickRes[i].day_unix == (today_unix - (60*60*24*8))) {
                let clickearn = clickRes[i].earned || 0;
                vssamedaylastweek += clickearn;
            }
            if(popRes[i] && popRes[i].day_unix == (today_unix - (60*60*24*8))) {
                let popearn = popRes[i].pearned || 0;
                vssamedaylastweek += popearn;
            }
            
            // Last 7 days
            if(clickRes[i] && clickRes[i].day_unix >= (today_unix - (60*60*24*7))) { 
                let clickearn = clickRes[i].earned || 0;
                earned7days += clickearn;
            }
            if(popRes[i] && popRes[i].day_unix >= (today_unix - (60*60*24*7))) {
                let popearn = popRes[i].pearned || 0;
                earned7days += popearn;
            }
            
            // Prev 7 days
            if(clickRes[i] && clickRes[i].day_unix >= (today_unix - (60*60*24*14)) && clickRes[i].day_unix < (today_unix - (60*60*24*7))) {
                let clickearn = clickRes[i].earned || 0;
                earnedprev7days += clickearn;
            }
            if(popRes[i] && popRes[i].day_unix >= (today_unix - (60*60*24*14)) && popRes[i].day_unix < (today_unix - (60*60*24*7))) {
                let popearn = popRes[i].pearned || 0;
                earnedprev7days += popearn;
            }
            // Last 30 days
            if(clickRes[i] && clickRes[i].day_unix >= (today_unix - (60*60*24*30))) {
                let clickearn = clickRes[i].earned || 0;
                earned30days += clickearn;
            }
            if(popRes[i] && popRes[i].day_unix >= (today_unix - (60*60*24*30))) {
                let popearn = popRes[i].pearned || 0;
                earned30days += popearn;
            }
            // Prev 30 days
            if(clickRes[i] && clickRes[i].day_unix >= (today_unix - (60*60*24*60)) && clickRes[i].day_unix < (today_unix - (60*60*24*30))) {
                let clickearn = clickRes[i].earned || 0;
                earnedprev30days += clickearn;
            }
            if(popRes[i] && popRes[i].day_unix >= (today_unix - (60*60*24*60)) && popRes[i].day_unix < (today_unix - (60*60*24*30))) {
                let popearn = popRes[i].pearned || 0;
                earnedprev30days += popearn;
            }
            i++;
        }

        // Performance
        let { views } = findBy(viewRes, today_unix, 'day_unix');
        let { pops } = findBy(popRes, today_unix, 'day_unix');
        let { clicks } = findBy(clickRes, today_unix, 'day_unix');
        let cpc = 'NA';
        if(clicks != 0)
            cpc = (todayEarned / clicks).toFixed(2);

        // Publisher balance
        let pub_balance = result[6][0]['pub_balance'];
        
        // Countries
        let countryStats = {};
        countryclicks.forEach(c => {
            // Find country Name
            let cid = c.country; 
            let [ccode, cname] = App_Settings.countries[cid];
            
            // find views
            let { cviews } = findBy(countryView, cid, 'country');
            countryStats[cname] = {
                "earned": c.cearned.toFixed(2),
                "views": cviews,
                "clicks": c.cclicks
            };
        });

        // Ad Units
        let ad_types = ['', 'text', 'banner', 'native', 'widget']
        const ad_units = {};
        for(let i = 1;i < ad_types.length;i++) {
            let today = 0;
            let yesterday = 0;
            adunits.forEach(data => {
                if(data.ad_type == i && data.day_unix == today_unix) {
                    today = data.adearned;
                }
                if(data.ad_type == i && data.day_unix == yesterday_unix) {
                    yesterday = data.adearned;
                }
            });
            ad_units[ad_types[i]] = [today.toFixed(2), yesterday.toFixed(2)];
        }
        // Ad pop
        let pop_earn_today = 0;
        let pop_earn_yesterday = 0;
        {
            let { pearned } = findBy(popRes, today_unix, 'day_unix');
            pop_earn_today += pearned;
        }
        {
            let { pearned } = findBy(popRes, yesterday_unix, 'day_unix');
            pop_earn_yesterday += pearned;
        }
        ad_units['pop'] = [pop_earn_today.toFixed(2), pop_earn_yesterday.toFixed(2)]; 

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
        while(true) {
            // Breask condition
            if(!ad_clickRes[i] && !ad_popRes[i]) break;

            // Today
            if(ad_clickRes[i] && ad_clickRes[i].day_unix == today_unix) { 
                let clickspent = ad_clickRes[i].spent || 0;
                todaySpent += clickspent;
            }
            if(ad_popRes[i] && ad_popRes[i].day_unix == today_unix) {
                let popspent = ad_popRes[i].pspent || 0;
                todaySpent += popspent;
            }
            // Yesterday
            if(ad_clickRes[i] && ad_clickRes[i].day_unix == yesterday_unix) {
                let clickspent = ad_clickRes[i].spent || 0;
                yesterdaySpent += clickspent;
            }
            if(ad_popRes[i] && ad_popRes[i].day_unix == yesterday_unix) {
                let popspent = ad_popRes[i].pspent || 0;
                yesterdaySpent += popspent;
            }
            // Vssamedaylastweek
            if(ad_clickRes[i] && ad_clickRes[i].day_unix == (today_unix - (60*60*24*8))) { 
                let clickspent = ad_clickRes[i].spent || 0;
                ad_vssamedaylastweek += clickspent; 
            }
            if(ad_popRes[i] && ad_popRes[i].day_unix == (today_unix - (60*60*24*8))) {
                let popspent = ad_popRes[i].pspent || 0;
                ad_vssamedaylastweek += popspent;
            }
            
            // Last 7 days
            if(ad_clickRes[i] && ad_clickRes[i].day_unix >= (today_unix - (60*60*24*7))) { 
                let clickspent = ad_clickRes[i].spent || 0;
                spent7days += clickspent;
            }
            if(ad_popRes[i] && ad_popRes[i].day_unix >= (today_unix - (60*60*24*7))) {
                let popspent = ad_popRes[i].pspent || 0;
                spent7days += popspent;
            }
            
            // Prev 7 days
            if(ad_clickRes[i] && ad_clickRes[i].day_unix >= (today_unix - (60*60*24*14)) && ad_clickRes[i].day_unix < (today_unix - (60*60*24*7))) {
                let clickspent = ad_clickRes[i].spent || 0;
                spentprev7days += clickspent;
            }
            if(ad_popRes[i] && ad_popRes[i].day_unix >= (today_unix - (60*60*24*14)) && ad_popRes[i].day_unix < (today_unix - (60*60*24*7))) {
                let popspent = ad_popRes[i].pspent || 0;
                spentprev7days += popspent;
            }
            // Last 30 days
            if(ad_clickRes[i] && ad_clickRes[i].day_unix >= (today_unix - (60*60*24*30))) {
                let clickspent = ad_clickRes[i].spent || 0;
                spent30days += clickspent;
            }
            if(ad_popRes[i] && ad_popRes[i].day_unix >= (today_unix - (60*60*24*30))) {
                let popspent = ad_popRes[i].pspent || 0;
                spent30days += popspent;
            }
            // Prev 30 days
            if(ad_clickRes[i] && ad_clickRes[i].day_unix >= (today_unix - (60*60*24*60)) && ad_clickRes[i].day_unix < (today_unix - (60*60*24*30))) {
                let clickspent = ad_clickRes[i].spent || 0;
                spentprev30days += clickspent;
            }
            if(ad_popRes[i] && ad_popRes[i].day_unix >= (today_unix - (60*60*24*60)) && ad_popRes[i].day_unix < (today_unix - (60*60*24*30))) {
                let popspent = ad_popRes[i].pspent || 0;
                spentprev30days += popspent;
            }
            i++;
        }


        // Performance
        let { ad_views } = findBy(ad_viewRes, today_unix, 'day_unix');
        let { ad_pops } = findBy(ad_popRes, today_unix, 'day_unix');
        let { ad_clicks } = findBy(ad_clickRes, today_unix, 'day_unix');
        let ad_cpc = 'NA';
        if(ad_clicks != 0)
            ad_cpc = (todaySpent / ad_clicks).toFixed(2);

        // Publisher balance
        let ad_balance = result[6][0]['ad_balance'];
        
        // Countries
        let ad_countryStats = {};
        ad_countryClicks.forEach(c => {
            // Find country Name
            let cid = c.country; 
            let [ad_ccode, ad_cname] = App_Settings.countries[cid];
            
            // find views
            let { ad_cviews } = findBy(ad_countryView, cid, 'country');
            ad_countryStats[ad_cname] = {
                "spent": c.cspent.toFixed(2),
                "views": ad_cviews,
                "clicks": c.ad_cclicks
            };
        });

        // Ad Units
        const ad_ad_units = {};
        for(let i = 1;i < ad_types.length;i++) {
            let today = 0;
            let yesterday = 0;
            ad_adunits.forEach(data => {
                if(data.ad_type == i && data.day_unix == today_unix) {
                    today = data.adspent;
                }
                if(data.ad_type == i && data.day_unix == yesterday_unix) {
                    yesterday = data.adspent;
                }
            });
            ad_ad_units[ad_types[i]] = [today.toFixed(2), yesterday.toFixed(2)];
        }
        // Ad pop
        let pop_spent_today = 0;
        let pop_spent_yesterday = 0;
        {
            let { pspent } = findBy(ad_popRes, today_unix, 'day_unix');
            pop_spent_today += pspent;
        }
        {
            let { pspent } = findBy(ad_popRes, yesterday_unix, 'day_unix');
            pop_spent_yesterday += pspent;
        }
        ad_ad_units['pop'] = [pop_spent_today.toFixed(2), pop_spent_yesterday.toFixed(2)];

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
            pub_ad_units: ad_units,
            ad_estimates: ad_estimates,
            ad_performance: ad_performance,
            ad_countries: ad_countryStats,
            ad_ad_units: ad_ad_units
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
        spent: 0, pspent: 0, cspent: 0, ad_pops: 0, ad_views:0, ad_cviews: 0, ad_clicks: 0, ad_cclicks: 0, adspent: 0 };
}