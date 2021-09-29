const { QueryTypes } = require("sequelize");
const Settings = require("../../models/settings");
const sequelize = require("../../utils/db");
const Payments = require('../../models/payments');
const User = require("../../models/users");
const Ref_Stats = require("../../models/ref_stats");
const { cronLogWrite } = require("../cron-logger");


exports.updateReferrelStats = async () => {
    
    /**
     * Get Todays payments check uid refs and update % 
     */
    try {
        // Ref commision
        const refQuery = await Settings.findOne({attributes: ['ref_commision']});
        const refCommision = refQuery.dataValues.ref_commision;

        const tDate = new Date().toISOString().slice(0, 10); 
        const tTime = Math.floor(new Date(tDate).getTime() / 1000);
        const yTime = Math.floor(tTime - (60*60*24));

        // Get Yesterday Payments by payment processor
        const yesterdayPayments = await sequelize.query("SELECT p.uid, p.amount, u.ref_by FROM payments p INNER JOIN users u ON p.uid = u.id WHERE p.status = 'captured' AND p.time_unix BETWEEN ? AND ?", {
            type: QueryTypes.SELECT,
            replacements: [yTime, tTime],
            mapToModel: Payments
        });

        // Update
        for(let data in yesterdayPayments) {
            if(data.ref_by != null) {
                const ref_uid = data.ref_by;
                if(!ref_uid) return;
                // Calculate ref Earnings
                const earnings = Math.floor(((refCommision / 100) * data.amount) * 10000) / 10000;
            
                // Update users
                const uUser = await sequelize.query('UPDATE users SET ref_earnings = ref_earnings + ? WHERE id = ?', {
                    type: QueryTypes.UPDATE,
                    replacements: [earnings, ref_uid],
                    mapToModel: User
                });

                // Update Stats
                const uStats = await sequelize.query('UPDATE ref_stats SET earned = earned + ? WHERE ref_uid = ? AND day_unix = ?', {
                    type: QueryTypes.UPDATE,
                    replacements: [earnings, ref_uid, yTime],
                    mapToModel: Ref_Stats
                });
                
                // Check if affected rows null
                if(uStats[1] == 0) {
                    // Insert Stats
                    const rStat = await Ref_Stats.create({
                        ref_uid: ref_uid,
                        earned: earnings,
                        day_unix: yTime
                    });
                }
            }
        }
       
        cronLogWrite('Updated referrel stats');
    } catch (err) {
        const msg = `Error occured updating referrel stats [${err}]`;
        cronLogWrite(msg);
    }
}