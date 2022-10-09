const { QueryTypes } = require("sequelize");
const User = require("../../../models/users");
const sequelize = require("../../../utils/db");
const Payments = require("../../../models/payments");

exports.adminPaymentsListHelper = async (req) => {
  if (!req.userInfo || req.userInfo.rank != 1) {
    const err = new Error("Not allowed!");
    err.statusCode = 401;
    throw err;
  }

  try {
    // Get posted data
    const pay_id = req.body.pay_id || null;
    const sort = req.body.sort;
    let sDate = req.body.sdate;
    let eDate = req.body.edate;
    const page = req.body.page || 1;

    // Convert dates to unix
    sDate = Math.floor(new Date(sDate).getTime() / 1000);
    eDate = Math.floor((new Date(eDate).getTime() / 1000) + (60*60*24)); // Add 1 more day for bcoz today_unix is at 12AM

    // Offset & Limit
    const limit = 50;
    const offset = (page - 1) * limit;

    // Limit query
    const limitQuery = `LIMIT ${limit} OFFSET ${offset}`;

    // Query builder
    let sQuery = `WHERE `;
    sQuery += `p.time_unix BETWEEN ${sDate} AND ${eDate}`;
    if(sort == 0) sQuery += ` AND p.status != 9`; // status 9 doesn't exist 0 means all
    if(sort == 1) sQuery += ` AND p.status = 'captured'`;
    if(sort == 2) sQuery += ` AND p.status = 'created'`;
    if(sort == 3) sQuery += ` AND p.status = 'refunded'`;
    if(pay_id) sQuery += ` AND p.mtx = '${pay_id}' OR p.rzr_order_id = '${pay_id}' OR p.rzr_payment_id = '${pay_id}'`;

    // Build query
    let fields =
      "p.id, p.uid, p.mtx, p.rzr_order_id, p.rzr_payment_id, p.amount, p.currency, p.exchange_rate, p.status, p.processor, p.time_unix, u.user";
    let resquery;
    let cquery;

    resquery = `SELECT ${fields} FROM payments p INNER JOIN users u ON p.uid = u.id ${sQuery} ORDER BY p.id DESC ${limitQuery}`;
    cquery = `SELECT COUNT(id) as total FROM payments p ${sQuery}`;

    let result = await sequelize.query(resquery, {
      type: QueryTypes.SELECT,
      mapToModel: [Payments, User],
    });
    let total = await sequelize.query(cquery, {
      type: QueryTypes.SELECT,
      mapToModel: Payments,
    });

    result = result.map((d) => {
      if (d.processor == 1) d.processor = "Payment Gateway";
      if (d.processor == 2) d.processor = "Conversion";
      if (d.processor == 3) d.processor = "System";

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

