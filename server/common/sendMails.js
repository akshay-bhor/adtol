const { EmailTransporter } = require("./emailTransporter");


exports.sendAlertMail = async (sub, msg) => {
    EmailTransporter.sendMail({
        to: 'adtol.com@gmail.com,akbhor50@gmail.com,macraze007@gmail.com',
        from: 'support@adtol.com',
        subject: `IMPORTANT: ${sub}`,
        html: `${msg}`
    }).catch(e => { console.log(e); });
}

exports.sendWelcomeMail = async (to, user) => {
    EmailTransporter.sendMail({
        to: to,
        from: 'support@adtol.com',
        subject: `AdTol.com - Welcome To AdTol `,
        html: `Dear <b>${user}</b>,<br><br>

            <b>Welcome to Adtol - The Best Self-Served Ad Network for Advertisers and Publishers!</b><br><br>

            <b>Want to Monetize Your Websites?</b><br>
            <a href="${process.env.ORIGIN}/dashboard/websites" 
            style="box-sizing:border-box;-webkit-appearance:none;-moz-appearance:none;appearance:none;
            background-color:#3f51b5;border-radius:4px;
            color:#fff;cursor:pointer;display:inline-block;font-size:14px;font-weight:400;
            line-height:1;margin:10px;padding:10px 15px;text-decoration:none;text-align:center;
            text-transform:uppercase;font-family:Montserrat,sans-serif;font-weight:700">Add Website</a>
            <br>
            <b>Click Below to Place AdCode on Your Website</b><br>
            <a href="${process.env.ORIGIN}/dashboard/get-adcode" 
            style="box-sizing:border-box;-webkit-appearance:none;-moz-appearance:none;appearance:none;
            background-color:#3f51b5;border-radius:4px;
            color:#fff;cursor:pointer;display:inline-block;font-size:14px;font-weight:400;
            line-height:1;margin:10px;padding:10px 15px;text-decoration:none;text-align:center;
            text-transform:uppercase;font-family:Montserrat,sans-serif;font-weight:700">Get Adcode</a>
            <br>
            <b>Want to Advertise Your Websites/Products/Services?</b><br>
            <a href="${process.env.ORIGIN}/billing/deposit" 
            style="box-sizing:border-box;-webkit-appearance:none;-moz-appearance:none;appearance:none;
            background-color:#3f51b5;border-radius:4px;
            color:#fff;cursor:pointer;display:inline-block;font-size:14px;font-weight:400;
            line-height:1;margin:10px;padding:10px 15px;text-decoration:none;text-align:center;
            text-transform:uppercase;font-family:Montserrat,sans-serif;font-weight:700">Deposit Ad Balance</a>
            <br>
            <b>Choose Your Ad Campaign Type and Create Your Ad</b> and start making Profits now!<br>
            <a href="${process.env.ORIGIN}/dashboard/campaign-type" 
            style="box-sizing:border-box;-webkit-appearance:none;-moz-appearance:none;appearance:none;
            background-color:#3f51b5;border-radius:4px;
            color:#fff;cursor:pointer;display:inline-block;font-size:14px;font-weight:400;
            line-height:1;margin:10px;padding:10px 15px;text-decoration:none;text-align:center;
            text-transform:uppercase;font-family:Montserrat,sans-serif;font-weight:700">Create Ad</a>

            <br><br>
            Regards,<br>
            Admin,<br>
            Adtol.com`
    }).catch(e => { console.log(e); });
}

exports.sendContactMail = async (email, name, subject, message) => {
        EmailTransporter.sendMail({
            to: 'adtol.com@gmail.com',
            from: email,
            subject: `Alert - You Got a New Message From ${name}`,
            html: `
                This is to inform you that you have got a new message on AdTol.
                Here's the transcript of the message - 

                <div><b>Name:</b> ${name}</div>
                <div><b>Email:</b> ${email}</div>
                <div><b>Subject:</b> ${subject}</div>
                <div><b>Message:</b> ${message}</div>
            `
        }).catch(e => { console.log(e); });
}

exports.sendForgotPassMail = async (mail, rand) => {
    EmailTransporter.sendMail({
        to: mail,
        from: 'support@adtol.com',
        subject: 'Adtol - Forgot Password',
        html: `
            <p>We received a password reset request for your account associated with this email.
            Click below to reset your password</p>
            <a href="${process.env.ORIGIN}/reset-password/${rand}" 
            style="box-sizing:border-box;-webkit-appearance:none;-moz-appearance:none;appearance:none;
            background-color:#3f51b5;border-radius:4px;
            color:#fff;cursor:pointer;display:inline-block;font-size:14px;font-weight:400;
            line-height:1;margin:10px;padding:10px 15px;text-decoration:none;text-align:center;
            text-transform:uppercase;font-family:Montserrat,sans-serif;font-weight:700">Reset</a>
            <br />
            <span style="color:red">Please note that this link is only valid for 10 minutes! Do not share this link with anyone!</span>
            <br>
            <p>You if haven't requested password reset then please ignore this email.</p>
        `
    }).catch(e => { console.log(e); });
}

exports.sendPaymentSuccessMail = async (to, user, amt, pay_id, processor) => {
    EmailTransporter.sendMail({
        to: to,
        from: 'support@adtol.com',
        subject: 'AdTol.com - Payment Received ',
        html: `
            Dear <b>${user}</b>,<br><br>

            Your Payment of, <b>$${amt}</b> has been <font color="green"><b>RECEIVED</b></font> and <b>$${amt}</b> has been <font color="green"><b>ADDED</b></font> to your Advertising Account Balance!<br>
            following are the details of your payment.
            <br />
            <span style="display:block"><b>Payment ID:</b> ${pay_id}</span>
            <span style="display:block"><b>Amount:</b> $${amt}</span>
            <span style="display:block"><b>Processed Via:</b> ${processor}</span>
            <br />

            <br>
            Regards,<br>
            Admin,<br>
            Adtol.com
        `
    }).catch(e => { console.log(e); });
}

exports.sendAcSuspendMail = async (to, user) => {
    EmailTransporter.sendMail({
        to: to,
        from: 'support@adtol.com',
        subject: 'AdTol.com - Account Suspended',
        html: `
        Dear <b>${user}</b>,<br><br>

        Your Account has been <font color="red"><b>SUSPENDED</b></font> for Policy Violations!<br>
        <b><a href="${process.env.ORIGIN}/guidelines">Read AdTol Guidelines</a>, fix the policy violations and reapply for approval.</b><br>

        <br><br>
        Regards,<br>
        Admin,<br>
        Adtol.com
        `
    }).catch(e => { console.log(e); });
}

exports.sendWdStatusMail = async (to, user, mtx, amt, fee, status, processor) => {
    EmailTransporter.sendMail({
      to: to,
      from: "support@adtol.com",
      subject: `AdTol - Your withdrawal request ID: ${mtx} is ${status}`,
      html: `
          Dear <b>${user}</b>,<br>
          Your USD withdrawal request has been ${status}, following are the details of your request.
          <br />
          <span style="display:block"><b>Withdraw ID:</b> ${mtx}</span>
          <span style="display:block"><b>Amount:</b> $${amt}</span>
          <span style="display:block"><b>Fee:</b> $${fee}</span>
          <span style="display:block"><b>Processed Via:</b> ${processor}</span>

          <br>
          Regards,<br>
          Admin,<br>
          Adtol.com
      `,
    }).catch((e) => {
      console.log(e);
    });
}

exports.sendCampaignCreatedMail = async (to, user, campaign_name) => {
    EmailTransporter.sendMail({
      to: to,
      from: "support@adtol.com",
      subject: `AdTol.com - Campaign Created`,
      html: `
        Dear <b>${user}</b>,<br><br>

        This email is to inform you that your campaign, <b>${campaign_name}</b> is successfully created and is now <font color="#2196f3"><b>PENDING</b></font> for Approval.<br>
        <b>Your campaign will be Approved/Rejected under 24 hours. Under some unforeseen circumstances it may take more than 24 hours!</b>

        <br><br>
        Regards,<br>
        Admin,<br>
        Adtol.com   
      `,
    }).catch((e) => {
      console.log(e);
    });
}

exports.sendCampaignApprovedMail = async (to, user, campaign_name) => {
    EmailTransporter.sendMail({
      to: to,
      from: "support@adtol.com",
      subject: `AdTol.com - Campaign Approved `,
      html: `
        Dear <b>${user}</b>,<br><br>

        We are glad to inform you that your campaign <b>"${campaign_name}"</b> has been <font color="green"><b>APPROVED</b></font> and 
        ready to reach its audience!<br>

        <br>
        Regards,<br>
        Admin,<br>
        Adtol.com
      `,
    }).catch((e) => {
      console.log(e);
    });
}

exports.sendCampaignRejectedMail = async (to, user, campaign_name) => {
    EmailTransporter.sendMail({
      to: to,
      from: "support@adtol.com",
      subject: `AdTol.com - Campaign Rejected`,
      html: `
        Dear <b>${user}</b>,<br><br>

        We regret to inform you that, your campaign <b>"${campaign_name}"</b> has been <font color="red"><b>REJECTED</b></font> due to violating our policies!<br>
        <b><a href="${process.env.ORIGIN}/guidelines">Read Advertisers Guidelines</a> and fix policy violations!</b><br>

        <p>Do not worry, once you fix your violations, you can reapply for approval any time you want!</p>

        <br><br>
        Regards,<br>
        Admin,<br>
        Adtol.com
      `,
    }).catch((e) => {
      console.log(e);
    });
}

exports.sendWebsitePendingMail = async(to, user, domain) => {
    EmailTransporter.sendMail({
      to: to,
      from: "support@adtol.com",
      subject: `AdTol.com - Website Added`,
      html: `
        Dear <b>${user}</b>,<br><br>

        Your Website, <b>${domain}</b> has been successfully added and is now
        <font color="blue"><b>PENDING</b></font> Approval!
        <p>Approval process may take upto 24 hours to complete. But, under some unforeseen cicumstances it may take more!</p>

        <br>
        Regards,<br>
        Admin,<br>
        Adtol.com
      `,
    }).catch((e) => {
      console.log(e);
    });
}

exports.sendWebsiteApprovedMail = async(to, user, domain) => {
    EmailTransporter.sendMail({
      to: to,
      from: "support@adtol.com",
      subject: `AdTol.com - Website Approved`,
      html: `
        Dear <b>${user}</b>,<br><br>

        We are glad to inform you that your Website, <b>"${domain}"</b> has been <font color="green"><b>APPROVED</b></font>!<br>
        <b>Click below to get adcode to place on your website!</b><br>
        <a href="${process.env.ORIGIN}/dashboard/get-adcode" 
        style="box-sizing:border-box;-webkit-appearance:none;-moz-appearance:none;appearance:none;
        background-color:#3f51b5;border-radius:4px;
        color:#fff;cursor:pointer;display:inline-block;font-size:14px;font-weight:400;
        line-height:1;margin:10px;padding:10px 15px;text-decoration:none;text-align:center;
        text-transform:uppercase;font-family:Montserrat,sans-serif;font-weight:700">Get AdCode</a>

        <br><br>
        Regards,<br>
        Admin,<br>
        Adtol.com
      `,
    }).catch((e) => {
      console.log(e);
    });
}

exports.sendWebsiteRejectedMail = async(to, user, domain) => {
    EmailTransporter.sendMail({
      to: to,
      from: "support@adtol.com",
      subject: `Adtol.com - Website Rejected `,
      html: `
        Dear <b>${user}</b>,<br><br>

        We regret to inform you that, your website <b>"${domain}"</b> has been and <font color="red"><b>REJECTED</b></font>.<br>
        <b><a href="${process.env.ORIGIN}/guidelines">Read AdTol Guidelines</a>, fix the policy violations and reapply for approval.</b><br>

        <br><br>
        Regards,<br>
        Admin,<br>
        Adtol.com
      `,
    }).catch((e) => {
      console.log(e);
    });
}