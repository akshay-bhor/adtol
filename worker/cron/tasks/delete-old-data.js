const { Op } = require("sequelize");
const Clicks = require("../../models/clicks");
const Views = require("../../models/views");
const Pops = require("../../models/pops");
const Summary_Os = require("../../models/summary_os");
const Summary_Browser = require("../../models/summary_browser");
const Summary_Country = require("../../models/summary_country");
const Summary_Device = require("../../models/summary_device");
const Issued_Tokens = require("../../models/issued_tokens");
const Token_Blacklist = require("../../models/token_blacklist");
const { cronLogWrite } = require('../cron-logger');

exports.deleteOldData = async () => {
    cronLogWrite("Started Deleting Old Data");

    // Get today date
    const tDate = new Date().toISOString().slice(0, 10);
    const today_unix = Math.floor(new Date(tDate).getTime() / 1000);

    // Get unix before 60 days
    const old_unix = Math.floor(today_unix - (60*60*24*60));

    try {
        // Delete from clicks views and pops and summary os, browser, device, country
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
        const delOs = await Summary_Os.destroy({
            where: {
                day_unix: {
                    [Op.lt]: old_unix
                }
            }
        });
        const delDevice = await Summary_Device.destroy({
            where: {
                day_unix: {
                    [Op.lt]: old_unix
                }
            }
        });
        const delCountry = await Summary_Country.destroy({
            where: {
                day_unix: {
                    [Op.lt]: old_unix
                }
            }
        });
        const delBrowser = await Summary_Browser.destroy({
            where: {
                day_unix: {
                    [Op.lt]: old_unix
                }
            }
        });
        // Issued Tokens
        const tokens = await Issued_Tokens.findAll({ 
            where: { 
                exp: {
                    [Op.lt]: today_unix
                } 
            } 
        });
        const delTokens = await Issued_Tokens.destroy({ 
            where: { 
                exp: {
                    [Op.lt]: today_unix
                } 
            } 
        });
        const tids = tokens.map(data => {
            return data.dataValues.id;
        })
        // const delTokenBlacklist = await Token_Blacklist.destroy({ 
        //     where: { 
        //         exp: {
        //             [Op.in]: tids
        //         } 
        //     } 
        // });

        cronLogWrite('Deleted Old Data');
    } catch (err) {
        const msg = `Error Occured deleting old data [${err}]`;
        cronLogWrite(msg);
    }
}