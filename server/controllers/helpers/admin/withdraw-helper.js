const { QueryTypes } = require("sequelize");
const { EmailTransporter } = require("../../../common/emailTransporter");
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
    if (wd_id) sQuery += ` AND w.mtx = '${wd_id}'`;

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
      d.payable = d.amount - (d.fee / 100) * d.amount;

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
  if (!req.userInfo || req.userInfo.rank != 1) {
    const err = new Error("Not allowed!");
    err.statusCode = 401;
    throw err;
  }

  try {
    // Get posted data
    const wd_id = +req.body.id;
    const status = +req.body.status;

    // No update for rejected
    const noUpdate = 3;

    if (
      typeof wd_id !== "number" ||
      (status != 1 && status != 2 && status != 3)
    ) {
      throw new Error("Invalid data posted!");
    }

    // Change status
    const cStatus = await sequelize.query('UPDATE withdraws SET status = ? WHERE id = ? AND status != ?', {
      type: QueryTypes.UPDATE,
      replacements: [status, wd_id, noUpdate]
    });

    // Withdrawal status
    let wstatus = "Processed";
    if (status === 2) wstatus = "Pending";
    if (status === 3) wstatus = "Denied";

    if(cStatus[1] === 0) {
      const err = new Error(`Already ${wstatus}`);
      err.statusCode = 422;
      throw err;
    }

    // Get user email
    const data = await sequelize.query(
      "SELECT u.id as uid, u.mail as email, w.mtx, w.amount, w.fee, w.processor from users u INNER JOIN withdraws w ON u.id = w.uid WHERE w.id = ?",
      {
        type: QueryTypes.SELECT,
        replacements: [wd_id],
      }
    );

    const wdUid = data[0].uid;
    const amt = +data[0].amount;

    // If rejected then add back to publisher balance
    if(status === 3) {
      await sequelize.query('UPDATE users SET pub_balance = pub_balance + ? WHERE id = ?', {
        type: QueryTypes.UPDATE,
        replacements:[amt, wdUid]
      });
    }

    const mail = data[0].email;
    const mtx = data[0].mtx;
    const fee = data[0].fee;
    const processor =
      data[0].processor === 1
        ? "Bank"
        : data[0].processor === 2
        ? "Paypal"
        : data[0].processor === 3
        ? "Payoneer"
        : `System - <span style='color:red'>Abuse</span>`;

    // Send Mail
    EmailTransporter.sendMail({
      to: mail,
      from: "support@adtol.com",
      subject: `AdTol - Your withdrawal request ID: ${mtx} is ${wstatus}`,
      html: `
          Hello,
          Your USD withdrawal request has been ${wstatus}, following are the details of your request.
          <br />
          <span style="display:block"><b>Withdraw ID:</b> ${mtx}</span>
          <span style="display:block"><b>Amount:</b> $${amt}</span>
          <span style="display:block"><b>Fee:</b> $${fee}</span>
          <span style="display:block"><b>Processed Via:</b> ${processor}</span>
      `,
    }).catch((e) => {
      console.log(e);
    });

    return {
      msg: "success",
    };
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    throw err;
  }
};
