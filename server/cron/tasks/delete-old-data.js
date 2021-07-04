const { Op } = require("sequelize");
const Clicks = require("../../models/clicks");
const Views = require("../../models/views");
const cronLogWrite = require('../cron-logger');

exports.deleteOldData = async () => {

    // Get today date
    const tDate = new Date().toISOString().slice(0, 10);
    const today_unix = Math.floor(new Date(tDate).getTime() / 1000);

    // Get unix before 60 days
    const old_unix = Math.floor(today_unix - (60*60*24*60));

    try {
        // Delete from clicks views and pops
        const delClicks = await Clicks.destroy({ 
            where: {
                day_unix: {
                    [Op.lt]: old_unix
                }
            }
        });
        const delViews = await Views.destroy({
            where: {
                day_unix: {
                    [Op.lt]: old_unix
                }
            }
        });
        const delPops = await Pops.destroy({
            where: {
                day_unix: {
                    [Op.lt]: old_unix
                }
            }
        });

        cronLogWrite('Deleted old data');
    } catch (err) {
        const msg = `Error Occured deleting old data [${err}]`;
        cronLogWrite(msg);
    }
}