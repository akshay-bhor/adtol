const { QueryTypes } = require("sequelize");
const sequelize = require("../../utils/db");
const { tinify } = require('../../common/util');
const { cronLogWrite } = require("../cron-logger")

exports.processDayParting = async () => {
    
    try {
        // Get all approved and !user paused ads , data => bot, status, type, adult, run
        const adData = await sequelize.query('SELECT c.id as campId, c.day, c.timezone, c.bot, c.status, a.id as adId, a.type, c.adult, c.run FROM campaigns c INNER JOIN ads a ON c.id = a.campaign_id WHERE c.status = 1 AND (c.run = 1 OR c.run = 3)', {
            type: QueryTypes.SELECT
        });
        
        for(let data of adData) {
            if(data.day == 0) {
                return;
            }
            else {
                // Data
                let campid = data.campId;
                let adid = data.adId;
                let dayArr = data.day.split('|').map(d => +d); // Convert to int for comparison
                
                // Get timezone
                let tz = data.timezone;
                let dt = new Date().toLocaleString('en-US', { timeZone: tz });
                let weekDay = (new Date(dt).getDay() + 1); // +1 bcoz 0 in db is all days and 0 in js is sunday
                
                // Check Update eligibility
                if((dayArr.includes(weekDay) && data.run == 3) || (!dayArr.includes(weekDay) && data.run == 1)) {
                    // Update
                    let str = '';
                    let run = 1;

                    if(!dayArr.includes(weekDay) && data.run == 1)
                        run = 3;
                    
                    str = '0|'+data.status+'|'+data.type+'|'+data.adult+'|'+run;
                    let match_hash = tinify(str);

                    // Update
                    let update = await sequelize.query('UPDATE campaigns c, ads a SET a.match_hash = ?, c.run = ? WHERE a.id = ? AND c.id = ?', {
                        type: QueryTypes.UPDATE,
                        replacements: [match_hash, run, adid, campid]
                    });
                }
            }
        }

        cronLogWrite('Processed day parting');
    } catch (err) {
        const msg = `Error occured processing day parting [${err}]`;
        cronLogWrite(msg);
    }
}