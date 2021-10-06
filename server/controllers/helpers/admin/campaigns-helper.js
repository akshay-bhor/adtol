const { QueryTypes } = require("sequelize");
const User = require("../../../models/users");
const sequelize = require("../../../utils/db");
const Campaigns = require("../../../models/campaigns");
const { tinify } = require("../../../common/util");

exports.getCampaignsListHelper = async (req) => {
  if (!req.userInfo || req.userInfo.rank != 1) {
    const err = new Error("Not allowed!");
    err.statusCode = 401;
    throw err;
  }

  try {
    // Get posted data
    const user = req.body.user || null;
    const sort = req.body.sort || 1;
    const page = req.body.page || 1;

    // Offset & Limit
    const limit = 50;
    const offset = (page - 1) * limit;

    // Limit query
    const limitQuery = `LIMIT ${limit} OFFSET ${offset}`;

    // Get user
    let uid = null;
    if(user) {
        const findUserid = await User.findOne({ where: { user: user }, attributes: ['id'] });
        if(!findUserid) throw new Error('Username not found!');
        else uid = findUserid.dataValues.id;
    }

    // Query builder
    let sQuery = `WHERE `;
    if(sort == 1) sQuery += `c.status != 5`;
    if(sort == 2) sQuery += `c.status = 2`;
    if(sort == 3) sQuery += `c.status = 3`;
    if(uid) sQuery += ` AND c.uid = ${uid}`;

    // Build query
    let fields =
      "c.id, c.uid, c.title, c.desc, c.url, c.campaign_type, c.adult, c.cpc, c.views, c.clicks, c.pops, c.budget, c.budget_rem, c.today_budget, c.today_budget_rem, c.spent, c.run, c.status, c.pro";
    let resquery;
    let cquery;
    
    resquery = `SELECT ${fields} FROM campaigns c ${sQuery} ORDER BY c.id DESC ${limitQuery}`;
    cquery = `SELECT COUNT(c.id) as total FROM campaigns c ${sQuery}`;

    let result = await sequelize.query(resquery, {
      type: QueryTypes.SELECT,
      mapToModel: Campaigns,
    });
    let total = await sequelize.query(cquery, {
      type: QueryTypes.SELECT,
      mapToModel: Campaigns,
    });

    // Get campaign types
    const camp_types = await sequelize.query('SELECT id, name FROM campaign_types', {
        type: QueryTypes.SELECT
    });

    const camp_types_list = [];
    camp_types.forEach(data => {
        camp_types_list[data.id] = data.name;
    });
    
    result = result.map((d) => {
      if (d.status == 1) d.status = "Approved";
      if (d.status == 2) d.status = "Pending";
      if (d.status == 3) d.status = "Rejected";
      if (d.status == 4) d.status = "Deleted";
      d.spent = d.spent.toFixed(2);
      d.campaign_type = camp_types_list[d.campaign_type] || 'Pop';
      if(d.adult == 1) d.adult = 'Adult';
      else d.adult = 'Non-Adult';

      return d;
    });

    return {
      result,
      total: total[0].total,
    };
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    throw err;
  }
};

exports.setCampaignStatusHelper = async (req) => {
    if (!req.userInfo || req.userInfo.rank != 1) {
        const err = new Error("Not allowed!");
        err.statusCode = 401;
        throw err;
    }

    try {
        // Get Payload
        const nstatus = req.body.status;

        if(nstatus != 1 && nstatus != 2 && nstatus != 3) {
            const err = new Error('Invalid Action!');
            err.statusCode = 422;
            throw err;
        }

        // Get campaign id
        const campId = req.body.id;

        // Get campaigns
        const campaigns = await sequelize.query('SELECT c.id, a.id as adid, c.bot, c.status, a.type, c.adult, c.run FROM campaigns c INNER JOIN ads a ON c.id = a.campaign_id WHERE c.id = ? AND c.status != 4', {
            type: QueryTypes.SELECT,
            replacements: [campId]
        });
        if(campaigns.length == 0) {
            throw new Error('Not Found or Deleted!');
        }

        for(let data of campaigns) {
            let id = data.id;
            let bot = data.bot;
            let status = data.status;
            let type = data.type;
            let adult = data.adult;
            let run = data.run;
            let ad_id = data.adid;

            if(status == 1 && status == nstatus) {
                const err = new Error('Already Approved!');
                err.statusCode = 422;
                throw err;
            }
            if(status == 2 && status == nstatus) {
                const err = new Error('Already Pending!');
                err.statusCode = 422;
                throw err;
            }
            if(status == 3 && status == nstatus) {
                const err = new Error('Already Rejected!');
                err.statusCode = 422;
                throw err;
            }

            // Construct new hash
            const str = `0|${+nstatus}|${+type}|${+adult}|${+run}`;
            const match_hash = tinify(str);
            
            // Update
            const update = await sequelize.query('UPDATE ads a, campaigns c SET c.status = ?, a.match_hash = ? WHERE c.id = ? AND a.id = ?', {
                type: QueryTypes.UPDATE,
                replacements: [nstatus, match_hash, id, ad_id]
            });
        }

        // Return
        return {
            msg: 'success'
        };

    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        throw err;
    }
}

exports.getCampaignBannersHelper = async (req) => {
    if (!req.userInfo || req.userInfo.rank != 1) {
        const err = new Error("Not allowed!");
        err.statusCode = 401;
        throw err;
    }

    try {
        const campid = req.query.id;

        const bannersInfo = await sequelize.query('SELECT src FROM banners WHERE campaign_id = ?', {
            type: QueryTypes.SELECT,
            replacements: [campid]
        });

        return bannersInfo.map(data => {
            return `${process.env.CLOUDFRONT_S3_ORIGIN}${data.src}`;
        });

    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        throw err;
    }
}

exports.getToggleProHelper = async (req) => {
    if (!req.userInfo || req.userInfo.rank != 1) {
        const err = new Error("Not allowed!");
        err.statusCode = 401;
        throw err;
    }

    try {
        const campid = req.query.id;

        const campInfo = await sequelize.query('SELECT pro FROM campaigns WHERE id = ?', {
            type: QueryTypes.SELECT,
            replacements: [campid]
        });

        const pro = campInfo[0].pro === 1 ? 0:1;

        const update = await sequelize.query('UPDATE campaigns SET pro = ? WHERE id = ?', {
            type: QueryTypes.UPDATE,
            replacements: [pro, campid]
        });

        return {
            msg: 'success'
        }

    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        throw err;
    }
}