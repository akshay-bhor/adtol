const { QueryTypes } = require("sequelize");
//const Campaigns = require("../../../models/campaigns");
const sequelize = require("../../../utils/db");
const User_info = require('../../../models/user_info');
const Users = require('../../../models/users');
const Pub_sites = require('../../../models/publisher_sites');
const Campaigns = require('../../../models/campaigns')

exports.userStatusHelper = async (req) => {
  if (!req.userInfo) {
    const err = new Error("Not Allowed!");
    err.statusCode = 401;
    throw err;
  }

  try {
    // Userid
    const userid = req.userInfo._id;

    // Flags
    let hasPay = false;
    let hasWeb = false;
    let hasCamp = false;
    let isLow = false;

    // Check if payment details and web and is low
    // const check_1 = await sequelize.query(
    //   "SELECT p.id as pid, p.ac_no, p.upi, p.paypal, p.payoneer, w.id as wid, u.ad_balance as balance FROM users u LEFT JOIN user_info p ON u.id = p.uid LEFT JOIN pub_sites w ON u.id = w.uid WHERE u.id = ? LIMIT 1",
    //   {
    //     replacements: [userid],
    //     type: QueryTypes.SELECT,
    //   }
    // );

    const check_1 = await Users.findOne({_id: userid});
    const pubsite = await Pub_sites.findOne({uid: userid});

    // Parse
    if (check_1.ad_balance < 5) isLow = true;
    if (check_1?.user_info != undefined && (check_1.user_info.ac_no != undefined ||
      check_1.user_info.upi != undefined ||
      check_1.user_info.paypal != undefined ||
      check_1.user_info.payoneer != undefined)) hasPay = true;
    if (pubsite?._id != undefined) hasWeb = true;

    // check if has camp
    const has_camp = await Campaigns.findOne({
      uid: userid
    });

    if (has_camp) hasCamp = true;

    return {
      hasCamp,
      hasPay,
      hasWeb,
      isLow,
    };
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    throw err;
  }
};
