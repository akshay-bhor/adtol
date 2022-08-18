const { QueryTypes } = require("sequelize");
const { tinify } = require("../../../common/util");
// const Pub_Sites = require("../../../models/publisher_sites");
const Pub_Sites = require("../../../models/publisher_sites");
// const User = require("../../../models/users");
const User = require("../../../models/users");
const sequelize = require("../../../utils/db");
const { App_Settings } = require('../../../common/settings');
const { sendWebsiteApprovedMail, sendWebsiteRejectedMail } = require("../../../common/sendMails");

exports.adminSitesListHelper = async (req) => {
  if (!req.userInfo || req.userInfo.rank != 1) {
    const err = new Error("Not allowed!");
    err.statusCode = 401;
    throw err;
  }

  try {
    // Get posted data
    const user = req.body.user || null;
    let site = req.body.site || null;
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

    // Site hash
    if(site) site = tinify(site);

    // Query builder
    // let sQuery = `WHERE `;
    // if(sort == 1) sQuery += `status != 9`;
    // if(sort == 2) sQuery += `status = 2`;
    // if(sort == 3) sQuery += `status = 3`;
    // if(uid) sQuery += ` AND uid = ${uid}`;
    // if(site) sQuery += ` AND hash = '${site}'`;

    let sQuery = {};
    if(sort == 1) sQuery.status = { $ne: 9 };
    if(sort == 2) sQuery.status = 2;
    if(sort == 3) sQuery.status = 3;
    if(uid) sQuery.uid = uid;
    if(site) sQuery.hash = site;

    // Build query
    let fields =
      "_id uid domain category language traffic adult views clicks pops earned status";
    let resquery;
    let cquery;

    resquery = await Pub_Sites.find(sQuery).select(fields).sort({_id: -1}).skip(offset).limit(limit).lean();
    cquery = await Pub_Sites.countDocuments(sQuery);

    // resquery = `SELECT ${fields} FROM pub_sites ${sQuery} ORDER BY id DESC ${limitQuery}`;
    // cquery = `SELECT COUNT(id) as total FROM pub_sites ${sQuery}`;

    let result = resquery.map((d) => {
      if (d.status == 1) d.status = "Active";
      if (d.status == 2) d.status = "Pending";
      if (d.status == 3) d.status = "Rejected";
      if (d.status == 4) d.status = "Deleted";
      d.category = App_Settings.categories[d.category];
      d.language = App_Settings.languages[d.language];
      d.earned = d.earned.toFixed(2);
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

exports.adminChangeSiteStatus = async (req) => {
  if (!req.userInfo || req.userInfo.rank != 1) {
    const err = new Error("Not allowed!");
    err.statusCode = 401;
    throw err;
  }

  try {
    // Get posted data
    const siteid = req.body.id;
    const status = req.body.status;

    if(typeof siteid != 'string' || (status != 1 && status != 2 && status != 3)) {
      throw new Error('Invalid data posted!');
    }

    // Change status
    const cStatus = await Pub_Sites.findOneAndUpdate({ _id: siteid },{ status: status });

    // Find userInfo
    const pub_sites = await Pub_Sites.findOne({ _id: siteid });

    const uInfo = await User.findOne({ _id: pub_sites.uid }).select("mail user");

    // const uInfo = await sequelize.query('SELECT u.mail, u.user, p.domain from users u INNER JOIN pub_sites p ON p.uid = u.id WHERE p.id = ?', {
    //   type: QueryTypes.SELECT,
    //   replacements: [siteid]
    // })

    const mail = uInfo.mail;
    const user = uInfo.user;
    const domain = pub_sites.domain;

    if(status == 1) {
      sendWebsiteApprovedMail(mail, user, domain);
    }
    if(status == 3) {
      sendWebsiteRejectedMail(mail, user, domain);
    }

    return {
      msg: 'success'
    }

  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    throw err;
  }
}
