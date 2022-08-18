const { QueryTypes } = require("sequelize");
const { EmailTransporter } = require("../../../common/emailTransporter");
const { sendWdStatusMail } = require("../../../common/sendMails");
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
    eDate = Math.floor((new Date(eDate).getTime() / 1000) + (60*60*24)); // Add 1 more day for bcoz today_unix is at 12AM

    // Offset & Limit
    const limit = 50;
    const offset = (page - 1) * limit;

    // Limit query
    // const limitQuery = `LIMIT ${limit} OFFSET ${offset}`;

    // Query builder
    // let sQuery = `WHERE `;
    // sQuery += `w.time_unix BETWEEN ${sDate} AND ${eDate}`;
    // if (sort == 0) sQuery += ` AND w.status != 9`; // status 9 doesn't exist 0 means all
    // if (sort == 1) sQuery += ` AND w.status = 1`;
    // if (sort == 2) sQuery += ` AND w.status = 2`;
    // if (sort == 3) sQuery += ` AND w.status = 3`;
    // if (wd_id) sQuery += ` AND w.mtx = '${wd_id}'`;

    let sQuery = {};
    sQuery.time_unix =  {$gte: sDate, $lt: eDate};
    if(sort == 0) sQuery.status = { $ne: 9 }; // status 9 doesn't exist 0 means all
    if(sort == 1) sQuery.status = 1;
    if(sort == 2) sQuery.status = 2;
    if(sort == 3) sQuery.status = 3;
    if (wd_id) sQuery.mtx = wd_id;

    // Build query
    let fields =
      "_id uid mtx amount fee status processor time_unix";
    let resquery;
    let cquery;

    // resquery = `SELECT ${fields} FROM withdraws w INNER JOIN users u ON w.uid = u.id ${sQuery} ORDER BY w.id DESC ${limitQuery}`;
    // cquery = `SELECT COUNT(id) as total FROM withdraws w ${sQuery}`;

    resquery = await Withdraw.find(sQuery).select(fields).sort({_id: -1}).skip(offset).limit(limit).lean();
    cquery = await Withdraw.countDocuments(sQuery);

    // let result = await sequelize.query(resquery, {
    //   type: QueryTypes.SELECT,
    //   mapToModel: [Withdraw, User],
    // });
    // let total = await sequelize.query(cquery, {
    //   type: QueryTypes.SELECT,
    //   mapToModel: Withdraw,
    // });

    const addUserToResult = (data) => {
      const promises = data.map(async (d) => {
        if (d.processor == 1) d.processor = "Bank";
        if (d.processor == 2) d.processor = "Paypal";
        if (d.processor == 3) d.processor = "Payoneer";
        if (d.processor == 4) d.processor = "System";
        // payable
        d.payable = d.amount - (d.fee / 100) * d.amount;

        let user = await User.findOne({_id: d.uid}).select("user");
        if(user) d.user = user.user;

        return d;
      });
      return Promise.all(promises);
    }

    let result = await addUserToResult(resquery);

    return {
      result,
      total: cquery,
    };
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    throw err;
  }
};

exports.adminChangeWithdrawsStatusHelper = async (req) => {
  if (!req.userInfo || req.userInfo.rank != 1) {
    const err = new Error("Not allowed!");
    err.statusCode = 401;
    throw err;
  }

  try {
    // Get posted data
    const wd_id = req.body.id;
    const status = req.body.status;

    // No update for rejected
    const noUpdate = 3;

    if(status != 1 && status != 2 && status != 3){
      throw new Error("Invalid data posted!");
    }

    // Change status
    // const cStatus = await sequelize.query('UPDATE withdraws SET status = ? WHERE id = ? AND status != ?', {
    //   type: QueryTypes.UPDATE,
    //   replacements: [status, wd_id, noUpdate]
    // });

    const cStatus = await Withdraw.findOneAndUpdate({_id: wd_id, status: {$ne: noUpdate}}, {status: status}, {new: true});

    // Withdrawal status
    let wstatus = "Processed";
    if (status === 2) wstatus = "Pending";
    if (status === 3) wstatus = "Denied";
    //
    if(!cStatus) {
      const err = new Error(`No update for rejected`);
      err.statusCode = 422;
      throw err;
    }

    // Get user email
    // const data = await sequelize.query(
    //   "SELECT u.id as uid, u.mail as email, u.user as username, w.mtx, w.amount, w.fee, w.processor from users u INNER JOIN withdraws w ON u.id = w.uid WHERE w.id = ?",
    //   {
    //     type: QueryTypes.SELECT,
    //     replacements: [wd_id],
    //   }
    // );
    const user = User.findOne({_id: wd_id}).select("_id mail user");

    const wdUid = user._id;
    const amt = +cStatus.amount;

    // If rejected then add back to publisher balance
    if(status === 3) {
      // await sequelize.query('UPDATE users SET pub_balance = pub_balance + ? WHERE id = ?', {
      //   type: QueryTypes.UPDATE,
      //   replacements:[amt, wdUid]
      // });
      await User.findOneAndUpdate({_id: wdUid}, {pub_balance: user.pub_balance + amt});
    }

    const mail = user.mail;
    const mtx = cStatus.mtx;
    const fee = cStatus.fee;
    const processor =
      cStatus.processor === 1
        ? "Bank"
        : cStatus.processor === 2
        ? "Paypal"
        : cStatus.processor === 3
          ? "Payoneer"
          : `System - <span style='color:red'>Abuse</span>`;
    const userName = user.user;

    // Send Mail
    sendWdStatusMail(mail, userName, mtx, amt, fee, wstatus, processor);

    return {
      msg: "success",
    };
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    throw err;
  }
};
