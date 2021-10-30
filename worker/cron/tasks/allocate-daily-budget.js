const { QueryTypes } = require("sequelize");
const User = require("../../../server/models/users");
const { sendBalanceExhaustedMail } = require("../../common/util");
const Campaigns = require("../../models/campaigns");
const sequelize = require("../../utils/db")
const { cronLogWrite } = require("../cron-logger")

exports.allocateDailyBudget = async () => {
    
    /**
     * fetch all ads with approved and running or machine pause status
     * at 12 midnght check deficiet for todays budget and only add that amount and deduct it from 
     * remaining budget
     */
    try {
        // Fetch all campaigns
        const camps = await sequelize.query('SELECT id, uid, campaign_title, budget_rem, today_budget, today_budget_rem FROM campaigns WHERE status = 1 AND (run = 1 OR run = 3)', {
            type: QueryTypes.SELECT,
            mapToModel: Campaigns
        });
        
        for(let data of camps) { 
            let id = data.id;
            let budget_rem = data.budget_rem;
            let today_budget = data.today_budget;
            let today_budget_rem = data.today_budget_rem;
            let userid = data.uid;
            let campaign_name = data.campaign_title;
            
            // Check deficit
            let deficiet = today_budget - today_budget_rem;

            // Check remaining budget
            if(budget_rem < deficiet) {
                deficiet = budget_rem;
                // Get user Info
                const uInfo = await User.findOne({ where: { id: userid } });
                const userMail = uInfo.dataValues.mail;
                const userName = uInfo.dataValues.user;
                // Send alert mail
                sendBalanceExhaustedMail(userMail, userName, campaign_name);
            }

            if(deficiet > 0) { 
                // Add deficiet to today_budget_rem and deduct from budget_rem

                const ts = await sequelize.query('UPDATE campaigns SET `today_budget_rem` = `today_budget_rem` + ?, `budget_rem` = `budget_rem` - ? WHERE id = ?', {
                    type: QueryTypes.UPDATE,
                    replacements: [deficiet, deficiet, id]
                });
            }
        }

        cronLogWrite('Allocated daily budgets');
    } catch (err) {
        const msg = `Error occured allocating daily budget [${err}]`;
        cronLogWrite(msg);
    }

    /**
     * problem with adding budget without deficit is ->
     * each ad could have day parting selected so on specific days they don't want ad to run
     * but bcoz of timezone issue it's hard to track at which time their day starts and keep track whether daily budget is already assigned 
     * or not 
     */
}