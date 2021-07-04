const Ref_Stats = require('../../../models/ref_stats');
const User = require('../../../models/users');
const sequelize = require('../../../utils/db');
const { QueryTypes, Op } = require('sequelize');
const base62 = require('base62');

exports.referrelsHelper = async (req) => {
    if(!req.userInfo) {
        const err = new Error('Not Allowed!');
        err.statusCode = 401;
        throw err;
    }

    try {

        // Userid
        const userid = req.userInfo.id;

        // Get earned, balance
        const ures = await User.findOne({ where: { id: userid }, attributes: ['ref_earnings', 'pub_balance'] });
        const ref_earnings = ures.dataValues.ref_earnings;
        const balance = ures.dataValues.pub_balanced;

        // Get referred users
        const rures = await sequelize.query('SELECT COUNT(id) as refs FROM users WHERE ref_by = ?', {
            type: QueryTypes.SELECT,
            replacements: [userid],
            mapToModel: User
        });

        const referred = rures[0].refs;

        // Get Stats
        const today = new Date().toISOString().slice(0, 10);
        const today_unix = Math.floor(new Date(today).getTime() / 1000);

        // 2 Month before
        const two_month_before = (today_unix - (60*60*24*60));
        
        // Get stats
        const stats = await Ref_Stats.findAll({ where: { 
                day_unix: {
                    [Op.gte]: two_month_before
                } 
            } 
        });

        const ref_stats = {};
        ci = 0;
        for(let i = 0;i < 60;i++) {
            let minus_unix = 0;
            if(i != 0) {
                minus_unix = (60*60*24*i);
            } 

            let date = new Date((today_unix - minus_unix) * 1000).toISOString().slice(0, 10);
            ref_stats[date] = {};

            if(stats[ci] && stats[ci].day_unix == (today_unix - minus_unix)) {
                ref_stats[date].earned = stats[ci].earned || 0;
                ci++;
            }
            else {
                ref_stats[date].earned = 0;
            }
        }

        // Share Link
        const share_link_code = base62.encode(userid);

        // Return
        return {
            total_earnings: ref_earnings,
            balance: balance,
            referred: referred,
            ref_stats: ref_stats,
            share_link_code: share_link_code
        };

    } catch (err) {
        if(!err.statusCode)
            err.statusCode = 500;
        throw err;
    }
}