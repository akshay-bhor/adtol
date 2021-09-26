const { QueryTypes } = require("sequelize");
const Campaigns = require("../../../models/campaigns");
const sequelize = require("../../../utils/db");

exports.userStatusHelper = async (req) => {
  if (!req.userInfo) {
    const err = new Error("Not Allowed!");
    err.statusCode = 401;
    throw err;
  }

  try {
    // Userid
    const userid = req.userInfo.id;

    // Flags
    let hasPay = false;
    let hasWeb = false;
    let hasCamp = false;
    let isLow = false;

    // Check if payment details and web and is low
    const check_1 = await sequelize.query(
      "SELECT p.id as pid, w.id as wid, u.ad_balance as balance FROM users u LEFT JOIN user_info p ON u.id = p.uid LEFT JOIN pub_sites w ON u.id = w.uid WHERE u.id = ? LIMIT 1",
      {
        replacements: [userid],
        type: QueryTypes.SELECT,
      }
    );
    
    // Parse
    if (check_1[0].balance < 5) isLow = true;
    if (check_1[0].pid != undefined) hasPay = true;
    if (check_1[0].wid != undefined) hasWeb = true;

    // check if has camp
    const has_camp = await Campaigns.findOne({
      where: { uid: userid },
      attributes: ["id"],
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
