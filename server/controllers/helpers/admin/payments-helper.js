const { QueryTypes } = require("sequelize");
// const User = require("../../../models/users");
const User = require("../../../models/users");
// const sequelize = require("../../../utils/db");
// const Payments = require("../../../models/payments");
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
    // const limitQuery = `LIMIT ${limit} OFFSET ${offset}`;

    // Query builder
    // let sQuery = `WHERE `;
    // sQuery += `p.time_unix BETWEEN ${sDate} AND ${eDate}`;
    // if(sort == 0) sQuery += ` AND p.status != 9`; // status 9 doesn't exist 0 means all
    // if(sort == 1) sQuery += ` AND p.status = 'captured'`;
    // if(sort == 2) sQuery += ` AND p.status = 'created'`;
    // if(sort == 3) sQuery += ` AND p.status = 'refunded'`;
    // if(pay_id) sQuery += ` AND p.mtx = '${pay_id}' OR p.rzr_order_id = '${pay_id}' OR p.rzr_payment_id = '${pay_id}'`;

    let sQuery = {};
    let sQueryOr = [];
    sQuery.time_unix =  {$gte: sDate, $lt: eDate};
    if(sort == 0) sQuery.status = { $ne: 9 }; // status 9 doesn't exist 0 means all
    if(sort == 1) sQuery.status = 'captured';
    if(sort == 2) sQuery.status = 'created';
    if(sort == 3) sQuery.status = 'refunded';
    if(pay_id) {
      sQueryOr.push({mtx: pay_id});
      sQueryOr.push({rzr_order_id: pay_id});
      sQueryOr.push({rzr_payment_id: pay_id});
    }else{
      sQueryOr = [{}];
    }

    // Build query
    let fields =
      "_id uid mtx rzr_order_id rzr_payment_id amount status processor time_unix";
    let resquery;
    let cquery;

    // resquery = `SELECT ${fields} FROM payments p INNER JOIN users u ON p.uid = u.id ${sQuery} ORDER BY p.id DESC ${limitQuery}`;
    // cquery = `SELECT COUNT(id) as total FROM payments p ${sQuery}`;

    resquery = await Payments.find({$and: [sQuery], $or:sQueryOr}).select(fields).sort({_id: -1}).skip(offset).limit(limit).lean();
    cquery = await Payments.countDocuments({$and: [sQuery], $or:sQueryOr});

    // let result = await sequelize.query(resquery, {
    //   type: QueryTypes.SELECT,
    //   mapToModel: [Payments, User],
    // });
    // let total = await sequelize.query(cquery, {
    //   type: QueryTypes.SELECT,
    //   mapToModel: Payments,
    // });

    const addUserToResult = (data) => {
      const promises = data.map(async (d) => {
        if (d.processor == 1) d.processor = "Payment Gateway";
        if (d.processor == 2) d.processor = "Conversion";
        if (d.processor == 3) d.processor = "System";
        let user = await User.findOne({_id: d.uid}).select("user");
        if(user) d.user = user.user;

        return d;
      });
      return Promise.all(promises);
    }

    let result = await addUserToResult(resquery);

    return {
      result,
      total: cquery
    };
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    throw err;
  }
};

