const { QueryTypes } = require("sequelize");
// const User = require("../../../models/users");
const User = require("../../../models/users");
const sequelize = require("../../../utils/db");
// const Campaigns = require("../../../models/campaigns");
const Campaigns = require("../../../models/campaigns");
const Campaign_types = require("../../../models/campaign_types");
const Ads = require("../../../models/ads");
const Banners = require("../../../models/banners");
const { tinify } = require("../../../common/util");
const { sendCampaignApprovedMail, sendCampaignRejectedMail } = require("../../../common/sendMails");

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
    // const limitQuery = `LIMIT ${limit} OFFSET ${offset}`;

    // Get user
    let uid = null;
    if(user) {
      const findUserid = await User.findOne({ user: user }).select("_id");
      if(!findUserid) throw new Error('Username not found!');
      else uid = findUserid._id;
    }

    // Query builder
    // let sQuery = `WHERE `;
    // if(sort == 1) sQuery += `c.status != 5`;
    // if(sort == 2) sQuery += `c.status = 2`;
    // if(sort == 3) sQuery += `c.status = 3`;
    // if(uid) sQuery += ` AND c.uid = ${uid}`;

    let sQuery = {};
    if(sort == 1) sQuery.status = { $ne: 5 };
    if(sort == 2) sQuery.status = 2;
    if(sort == 3) sQuery.status = 3;
    if(uid) sQuery.uid = uid;

    // Build query
    let fields =
      "_id uid campaign_title title desc url campaign_type adult cpc views clicks pops budget budget_rem today_budget today_budget_rem spent run status pro";
    let resquery;
    let cquery;

    // resquery = `SELECT ${fields} FROM campaigns c ${sQuery} ORDER BY c.id DESC ${limitQuery}`;
    // cquery = `SELECT COUNT(c.id) as total FROM campaigns c ${sQuery}`;

    resquery = await Campaigns.find(sQuery).select(fields).sort({_id: -1}).skip(offset).limit(limit).lean();
    cquery = await Campaigns.countDocuments(sQuery);

    // let result = await sequelize.query(resquery, {
    //   type: QueryTypes.SELECT,
    //   mapToModel: Campaigns,
    // });
    // let total = await sequelize.query(cquery, {
    //   type: QueryTypes.SELECT,
    //   mapToModel: Campaigns,
    // });

    // Get campaign types
    // const camp_types = await sequelize.query('SELECT id, name FROM campaign_types', {
    //     type: QueryTypes.SELECT
    // });

    const camp_types = await Campaign_types.find().select("_id name");

    const camp_types_list = [];
    camp_types.forEach(data => {
      camp_types_list[data._id] = data.name;
    });

    let result = resquery.map((d) => {
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
      total: cquery
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
    // const campaigns = await sequelize.query('SELECT c.id, c.uid, c.campaign_title, a.id as adid, c.bot, c.status, a.type, c.adult, c.run FROM campaigns c INNER JOIN ads a ON c.id = a.campaign_id WHERE c.id = ? AND c.status != 4', {
    //     type: QueryTypes.SELECT,
    //     replacements: [campId]
    // });
    const campaigns = await Campaigns.find({_id: campId}).select("_id uid campaign_title bot status adult run ads");
    if(campaigns.length == 0) {
      throw new Error('Not Found or Deleted!');
    }

    const userId = campaigns[0].uid;
    const campaign_name = campaigns[0].campaign_title;

    for(let data of campaigns) {
      let id = data._id;
      let bot = data.bot;
      let status = data.status;
      let adult = data.adult;
      let run = data.run;

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

      await Campaigns.findOneAndUpdate({_id: id}, {status: nstatus});

      for(let ad of data.ads){
        let ads = await Ads.find({_id: ad});
        let ad_id = ads._id;
        let type = ads.type;

        // Construct new hash
        const str = `0|${+nstatus}|${+type}|${+adult}|${+run}`;
        const match_hash = tinify(str);

        // Update
        // const update = await sequelize.query('UPDATE ads a, campaigns c SET c.status = ?, a.match_hash = ? WHERE c.id = ? AND a.id = ?', {
        //   type: QueryTypes.UPDATE,
        //   replacements: [nstatus, match_hash, id, ad_id]
        // });
        await Ads.findOneAndUpdate({_id: ad_id}, {match_hash: match_hash});
      }
    }

    // Get UserInfo
    const uInfo = await User.findOne({ _id: userId });

    // Send Campaign Created/Pending Mail
    if(nstatus == 1) {
      sendCampaignApprovedMail(uInfo.mail, uInfo.user, campaign_name);
    }

    if(nstatus == 3) {
      sendCampaignRejectedMail(uInfo.mail, uInfo.user, campaign_name);
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

    // const bannersInfo = await sequelize.query('SELECT src FROM banners WHERE campaign_id = ?', {
    //     type: QueryTypes.SELECT,
    //     replacements: [campid]
    // });

    const bannersInfo = await Banners.find({campaign_id: campid});

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

    // const campInfo = await sequelize.query('SELECT pro FROM campaigns WHERE id = ?', {
    //     type: QueryTypes.SELECT,
    //     replacements: [campid]
    // });

    const campInfo = await Campaigns.findOne({_id: campid}).select("pro");

    const pro = campInfo.pro === 1 ? 0:1;

    // const update = await sequelize.query('UPDATE campaigns SET pro = ? WHERE id = ?', {
    //     type: QueryTypes.UPDATE,
    //     replacements: [pro, campid]
    // });

    const update = await Campaigns.findOneAndUpdate({_id: campid}, {pro: pro});

    return {
      msg: 'success'
    }

  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    throw err;
  }
}
