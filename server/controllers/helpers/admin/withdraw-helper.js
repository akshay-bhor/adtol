const { QueryTypes } = require("sequelize");
const User = require("../../../models/users");
const Withdraw = require("../../../models/withdraw");
const sequelize = require("../../../utils/db");

exports.adminWithdrawsListHelper = async (req) => {
  if (!req.userInfo || req.userInfo.rank != 1) {
    const err = new Error("Not allowed!");
    err.statusCode = 401;
    throw err;
  }

  try {
    // Get posted data
    const wd_id = req.body.wd_id || null;
    const sort = req.body.sort;
    let sDate = req.body.sdate;
    let eDate = req.body.edate;
    const page = req.body.page || 1;

    // Convert dates to unix
    sDate = Math.floor(new Date(sDate).getTime() / 1000);
    eDate = Math.floor(new Date(eDate).getTime() / 1000);

    // Offset & Limit
    const limit = 50;
    const offset = (page - 1) * limit;

    // Limit query
    const limitQuery = `LIMIT ${limit} OFFSET ${offset}`;

    // Query builder
    let sQuery = `WHERE `;
    sQuery += `w.time_unix BETWEEN ${sDate} AND ${eDate}`;
    if (sort == 0) sQuery += ` AND w.status != 9`; // status 9 doesn't exist 0 means all
    if (sort == 1) sQuery += ` AND w.status = 1`;
    if (sort == 2) sQuery += ` AND w.status = 2`;
    if (sort == 3) sQuery += ` AND w.status = 3`;
    if (wd_id)
      sQuery += ` AND w.mtx = '${wd_id}'`;

    // Build query
    let fields =
      "w.id, w.uid, w.mtx, w.amount, w.fee, w.status, w.processor, w.time_unix, u.user";
    let resquery;
    let cquery;

    resquery = `SELECT ${fields} FROM withdraws w INNER JOIN users u ON w.uid = u.id ${sQuery} ORDER BY w.id DESC ${limitQuery}`;
    cquery = `SELECT COUNT(id) as total FROM withdraws w ${sQuery}`;

    let result = await sequelize.query(resquery, {
      type: QueryTypes.SELECT,
      mapToModel: [Withdraw, User],
    });
    let total = await sequelize.query(cquery, {
      type: QueryTypes.SELECT,
      mapToModel: Withdraw,
    });

    result = result.map((d) => { 
      if (d.processor == 1) d.processor = "Bank";
      if (d.processor == 2) d.processor = "Paypal";
      if (d.processor == 3) d.processor = "Payoneer";
      if (d.processor == 4) d.processor = "System";
      // payable
      d.payable = d.amount - ((d.fee / 100) * d.amount);

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

exports.adminChangeWithdrawsStatusHelper = async (req) => {

}
