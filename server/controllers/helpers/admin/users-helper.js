const { QueryTypes } = require("sequelize");
// const User = require("../../../models/users");
const User = require("../../../models/users");
const sequelize = require("../../../utils/db");
const { App_Settings } = require("../../../common/settings");
const { tinify, createUniquePaymentId } = require("../../../common/util");
const Token = require("../../../common/token");
// const Withdraw = require("../../../models/withdraw");
// const Payments = require("../../../models/payments");
const Withdraw = require("../../../models/withdraw");
const Payments = require("../../../models/payments");
const Campaigns = require("../../../models/campaigns");
const Pub_Sites = require("../../../models/publisher_sites");
const Ads = require("../../../models/ads");
const { sendAcSuspendMail } = require("../../../common/sendMails");

exports.adminUsersListHelper = async (req) => {
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

    // User query
    let userQuery = {};
    if (user) userQuery = {user: user};

    // Build query
    let fields =
      "_id user mail country mobile name surname ac_type company_name pub_earnings ref_earnings ad_spending ad_balance pub_balance pub_views pub_clicks pub_pops ad_views ad_clicks ad_pops status rank";
    let resquery;
    let cquery;
    if (sort == 1) {
      resquery = await User.find(userQuery).select(fields).sort({_id: -1}).skip(offset).limit(limit).lean();
      cquery = await User.countDocuments(userQuery);
    }
    if (sort == 2) {
      resquery = await User.find(userQuery).select(fields).sort({pub_earnings: -1}).skip(offset).limit(limit).lean();
      cquery = await User.countDocuments(userQuery);
    }
    if (sort == 3) {
      resquery = await User.find({status: 2}).select(fields).sort({_id: -1}).skip(offset).limit(limit).lean();
      cquery = await User.countDocuments({status: 2});
    }

    let result = resquery.map((d) => {
      let item = d;
      if (d.ac_type == 1) item.ac_type = "Individual";
      if (d.ac_type == 2) item.ac_type = "Company";
      if (d.rank == 1) d.rank = "Admin";
      if (d.rank == 2) d.rank = "Mod";
      if (d.rank == 3) d.rank = "User";
      if (d.status == 1) d.status = "Active";
      if (d.status > 1) d.status = "Inactive";
      let cCode = d.country;
      d.country = App_Settings.countries[cCode][1];
      // Country dial code
      d.dial_code = App_Settings.countries[cCode][2];

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

exports.adminUserStatusChangeHelper = async (req) => {
  if (!req.userInfo || req.userInfo.rank != 1) {
    const err = new Error("Not allowed!");
    err.statusCode = 401;
    throw err;
  }

  try {
    // Get uid
    const uid = req.params.uid;

    /**
     * Change user status
     * Campaigns status and match_hash
     * Websites status
     * Token blacklist
     */

    // Create transaction
    // const ts = await sequelize.transaction();
    try {
      // Get user status
      const userInfo = await User.findOne({ _id: uid }, "user mail status pub_balance");
      const userStatus = userInfo.status;
      const pubBalance = userInfo.pub_balance;
      const adBalance = userInfo.ad_balance;
      const userName = userInfo.user;
      const userMail = userInfo.mail;

      // Status to set
      let setStatus = 2;
      if (userStatus != 1) setStatus = 1;

      // Change user status
      const updateUserInfo = await User.findOneAndUpdate({ _id: uid }, { status: setStatus }, {new: true});

      // Get user campaigns
      // const userCampaigns = await sequelize.query(
      //   "SELECT c.id as cid, a.id as aid, c.bot, a.type, c.adult, c.run, c.budget_rem, c.today_budget_rem FROM campaigns c INNER JOIN ads a ON c.id = a.campaign_id WHERE c.uid = ?",
      //   {
      //     type: QueryTypes.SELECT,
      //     replacements: [1000],
      //   }
      // );

      const userCampaigns = await Campaigns.find({uid: uid}).select("bot adult run budget_rem today_budget_rem ads");

      // Create arr for campaign balance
      let processedCamps = [];

      // Update
      for (let d of userCampaigns) {
        // Get data
        // let aid = d.aid;
        let cid = d._id;
        let bot = d.bot;
        // let type = d.type;
        let adult = d.adult;
        let run = d.run;
        let balToAdd = d.budget_rem + d.today_budget_rem;
        if (processedCamps.includes(cid)) balToAdd = 0;
        else processedCamps.push(cid);
        let cStatus = 3;
        // if (setStatus == 1) cStatus = 1;
        let setBudget = 0;

        for (let aid of d.ads) {
          let ad = await Ads.findOne({_id: aid});
          let type = ad.type;

          // Create Match_Hash
          let str = `${bot}|${cStatus}|${type}|${adult}|${run}`;
          let match_hash = tinify(str);

          // Set total and today budget to 0
          // let up = await sequelize.query(
          //   "UPDATE campaigns c, ads a SET a.match_hash = ?, c.status = ?, c.today_budget_rem = ?, c.budget_rem = ? WHERE c.id = ? AND a.id = ?",
          //   {
          //     type: QueryTypes.UPDATE,
          //     replacements: [match_hash, cStatus, setBudget, setBudget, cid, aid],
          //     transaction: ts,
          //   }
          // );

          await Ads.findOneAndUpdate({ _id: aid }, { match_hash: match_hash}, {new: true});
        }
        await Campaigns.findOneAndUpdate({ _id: cid }, { status: cStatus, today_budget_rem: setBudget, budget_rem: setBudget}, {new: true});


        // If banning then add back to user ad balance
        // if (setStatus == 2) {
        //   let uUp = await sequelize.query(
        //     "UPDATE users SET `ad_balance` = `ad_balance` + ? WHERE id = ?",
        //     {
        //       type: QueryTypes.UPDATE,
        //       replacements: [balToAdd, uid],
        //       transaction: ts,
        //     }
        //   );
        // }
        await User.findOneAndUpdate({ _id: uid }, { ad_balance: adBalance + balToAdd }, {new: true});
      }

      // Website status
      let wStatus = 3;
      // // if (setStatus == 1) wStatus = 1;
      // const webStatus = await sequelize.query(
      //   "UPDATE pub_sites SET status = ? WHERE uid = ? AND (status = 1 OR status = 3)",
      //   {
      //     type: QueryTypes.UPDATE,
      //     replacements: [wStatus, uid],
      //     transaction: ts,
      //   }
      // );
      const webStatus = await Pub_Sites.updateMany({ uid: uid }, { status: wStatus });

      // If banning then confiscate balance
      if (setStatus == 2) {
        const confiscate = await User.findOneAndUpdate({ _id: uid }, { pub_balance: 0 }, {new: true});
        // Create withdraw
        const wd_id = createUniquePaymentId("wd");
        const time_unix = Math.floor(new Date().getTime() / 1000);
        const createWithdraw = await Withdraw.create(
          {
            uid: uid,
            mtx: wd_id,
            amount: pubBalance,
            processor: 4,
            status: 1,
            time_unix: time_unix
          }
        );

        // Send Mail
        sendAcSuspendMail(userMail, userName);
      }

      // Token Blacklist
      const tokenObj = new Token();
      const tBlacklist = await tokenObj.addTokenBlacklist(uid, 1);

      // await ts.commit();
    } catch (err) {
      // await ts.rollback();
      throw new Error(err);
    }

    // Return
    return {
      msg: "success",
    };
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    throw err;
  }
};

exports.adminAdjustUserBalanceHelper = async (req, res, next) => {
  if (!req.userInfo || req.userInfo.rank != 1) {
    const err = new Error("Not allowed!");
    err.statusCode = 401;
    throw err;
  }

  try {
    // Check if type number
    const amt = Math.floor(+req.body.amt * 1000) / 1000;
    if (typeof amt != "number") {
      const err = new Error("Not a Number!");
      err.statusCode = 422;
      throw err;
    }

    // Get type
    const type = req.params.type;
    const userid = req.params.uid;

    if (type == "ad") {
      // Add

      // Transaction
      // const ts = await sequelize.transaction();
      try {
        // Update user ad balance
        // const userUpdate = await sequelize.query(
        //   "UPDATE users SET `ad_balance` = `ad_balance` + ? WHERE id = ?",
        //   {
        //     type: QueryTypes.UPDATE,
        //     replacements: [amt, userid],
        //   }
        // );

        const user = await User.findOne({_id: userid});
        const userUpdate = await User.findOneAndUpdate({_id: userid}, {ad_balance: user.ad_balance + amt});

        // Create Payment
        const pay_id = createUniquePaymentId("pay");
        const pay_status = "captured";
        const time_unix = Math.floor(new Date().getTime()/ 1000);
        const processor = 3; // Admin

        const cPayment = await Payments.create({
          uid: userid,
          mtx: pay_id,
          amount: amt,
          status: pay_status,
          processor,
          time_unix,
        });

        // await ts.commit();
      } catch (err) {
        // await ts.rollback();
        throw err;
      }
    } else {
      // withdraw
      // Transaction
      // const ts = await sequelize.transaction();
      try {
        // Update user Pub balance
        // const userUpdate = await sequelize.query(
        //   "UPDATE users SET `pub_balance` = `pub_balance` - ? WHERE id = ?",
        //   {
        //     type: QueryTypes.UPDATE,
        //     replacements: [amt, userid],
        //   }
        // );

        const user = await User.findOne({_id: userid});
        const userUpdate = await User.findOneAndUpdate({_id: userid}, {pub_balance: user.pub_balance - amt});

        // Create Withdraw
        const pay_id = createUniquePaymentId("wd");
        const pay_status = 1;
        const time_unix = Math.floor(new Date().getTime() / 1000);
        const processor = 4; // Admin

        const cWithdraw = await Withdraw.create({
          uid: userid,
          mtx: pay_id,
          amount: amt,
          status: pay_status,
          processor,
          time_unix,
        });

        // await ts.commit();
      } catch (err) {
        // await ts.rollback();
        throw err;
      }
    }

    // Response
    return {
      msg: 'success'
    }

  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    throw err;
  }
}
