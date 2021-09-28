const User = require('../../models/users');
const {  validationResult, check, oneOf } = require('express-validator');
const bcrypt = require('bcryptjs');
const Filter = require('bad-words');
const base62 = require('base62');
const Token = require('../../common/token');
const { Op, QueryTypes } = require('sequelize');
const sequelize = require('../../utils/db');
const crypto = require('crypto');
const User_Info = require('../../models/user_info');
const { EmailTransporter } = require('../../common/emailTransporter');
const { App_Settings } = require('../../common/settings');
const filter = new Filter();

exports.registerHelper = async (req) => { 
    // Check if logged in ?
    if(req.userInfo) {
        const err = new Error('Already Logged In!');
        err.statusCode = 403;
        throw err;
    }
    
    await check('user').exists().trim().isAlphanumeric().withMessage('Invalid Username, Only alphanumeric characters allowed!').run(req);
    await check('user').isLength({ min: 4, max: 20 }).withMessage('Min Username Length 4 maxlength 20').run(req);
    await check('mail').exists().trim().isEmail().withMessage('Invalid Email!').normalizeEmail().run(req);
    if(!req.body.gid)
        await check('pass').exists().isLength({ min:8 }).withMessage('Minimum Password Length is 8!').run(req);
    await check('country').exists().isInt().withMessage('Invalid Country').run(req);
    await check('mobile').exists().isInt().isLength({ min:4, max:10 }).withMessage('Min length 4, Max 10').isMobilePhone('Invalid Mobile').withMessage('Invalid Phone no!').run(req);
    await check('name').optional().isAlpha().withMessage('Only letters allowed in name').run(req);
    await check('surname').optional().isAlpha().withMessage('Only letters allowed in surname').run(req);
    await check('ac_type').exists().isInt().withMessage('Invalid Account Type!').run(req);
    if(req.body.ac_type != 1)
        await check('company_name').exists().isString().withMessage('Plaese enter valid company name').run(req);
    if(req.body.ref_by) await check('ref_by').exists().isAlphanumeric().withMessage('Invalid Referrel').escape().run(req);
    
    try {
        const errs = validationResult(req);
        if(!errs.isEmpty()) {
            const err = new Error('Validation Error!');
            err.statusCode = 422;
            err.data = errs.array();
            throw err;
        }
        
        // Check Account type 
        if(req.body.ac_type != 1 && req.body.ac_type != 2) {
            throw new Error('Invaid Account Type!');
        }

        // Check for profanify
        if(filter.isProfane(`${req.body.user} ${req.body.name} ${req.body.surname} ${req.body.mail}`)) {
            const err = new Error('Name, Username, and Emails containing profanity are prohibited!');
            err.statusCode = 422;
            throw err;
        }
    
        // Check if Username exists
        const unameExist = await User.findOne({ where: { user: req.body.user } })
        
        if(unameExist) { 
            throw new Error('Username Already Exist!');
        }
        //Check if email exists
        const emailExists = await User.findOne({ where: { mail: req.body.mail } });
        if(emailExists) {
            throw new Error('Email Already Exist!');
        }
        // Check referrel
        let ref_by = base62.decode(req.body.ref_by);
        const refExist = await User.findOne({ where: { id: ref_by } });
        if(!refExist) {
            ref_by = null;
        }

        // Name & surname
        const name = req.body.name || null;
        const surname = req.body.surname || null;

        // Google id
        const gid = req.body.gid || null;

        //Create hash
        const pw = req.body.pass?.toString() || null;
        let hashPw = null;
        if(pw)
            hashPw = await bcrypt.hash(pw, 12);

        // Create new user
        const cUser = await User.create({
            user: req.body.user,
            mail: req.body.mail,
            name,
            surname,
            gid,
            pass: hashPw,
            country: req.body.country,
            mobile: req.body.mobile,
            name: req.body.name,
            surname: req.body.surname,
            ac_type: req.body.ac_type,
            company_name: req.body.company_name,
            ref_by
        });

        //Create token
        const tokenObj = new Token();
        const token = await tokenObj.createAccessToken(cUser);

        // Return object
        return {
            msg: 'success',
            token: token,
            expiresIn: '90'
        };
    }   
    catch(err) { 
        if(!err.statusCode)
            err.statusCode = 500;
        throw err;
    }
}

exports.loginHelper = async (req) => {
    if(req.userInfo) {
        let err = new Error('Already Logged In!');
        err.statusCode = 403;
        throw err;
    }

    // Validate input
    await oneOf([
        check('client').exists().trim().isEmail().normalizeEmail(),
        check('client').exists().trim().isAlphanumeric(),
    ], 'Please enter valid username or email!');
    await check('pass').exists().trim().isString().isLength({ min:8, max:20 }).withMessage('Minimum password length is 8!').run(req);

    try {
        const errs = validationResult(req);
        if(!errs.isEmpty()) {
            const err = new Error('Validation Failed!');
            err.statusCode = 422;
            err.data = errs.array();
            throw err;
        }

        // Data
        const client = req.body.client;
        const pass = req.body.pass;

        // Search Username or email
        const user = await User.findOne({ 
            where: { 
                [Op.or]: [
                    { user: client },
                    { mail: client }
                ],
                status: 1
            } 
        });

        if(user && user.dataValues.pass !== null) {
            // Check if pass correct
            let storedPass = user.dataValues.pass;
            let passCorrect = await bcrypt.compare(pass, storedPass);

            if(passCorrect) {
                //Create token
                const tokenObj = new Token();
                const token = await tokenObj.createAccessToken(user);

                // Return object
                return {
                    msg: 'success',
                    token: token,
                    expiresIn: '90'
                };
            }
            else {
                let err = new Error('Username or Password Incorrect!');
                err.statusCode = 400;
                throw err;
            }
        }
        else {
            let err = new Error('Username or Password Incorrect!');
            err.statusCode = 400;
            throw err;
        }
    }
    catch(err) {
        if(!err.statusCode)
            err.statusCode = 500;

        throw err;
    }
}

exports.gLoginHelper = async (req) => {
    if(req.userInfo) {
        let err = new Error('Already Logged In!');
        err.statusCode = 403;
        throw err;
    }

    await check('gid').exists().trim().isLength({ min: 21, max:21 }).withMessage('Invalid Login').run(req);
    await check('mail').exists().trim().isEmail().withMessage('Invalid Email').run(req);

    try {
        const errs = validationResult(req);
        if(!errs.isEmpty()) {
            const err = new Error('Validation Failed');
            err.statusCode = 422;
            err.data = errs.array();
            throw err;
        }

        const gid = req.body.gid;
        const mail = req.body.mail;

        // Get User Info
        const user = await User.findOne({ 
            where: { 
                [Op.or] : [
                    { gid: gid }, 
                    { mail: mail }
                ] 
            }
        });

        if(user) {
            //Create token
            const tokenObj = new Token();
            const token = await tokenObj.createAccessToken(user);

            // Return object
            return {
                msg: 'success',
                token: token,
                expiresIn: '90'
            };

        } else {
            const err = new Error('User doesn\'t exist, try signing up first');
            err.statusCode = 303;
            throw err;
        }
    }
    catch(err) {
        if(!err.statusCode)
            err.statusCode = 500;

        throw err;
    }
}

exports.changePassHelper = async (req) => {
    // Check if logged in?
    if(!req.userInfo) {
        const err = new Error('Not allowed!');
        err.statusCode = 401;
        throw err;
    }

    await check('opass').exists().trim().isLength({ min: 8, max:20 }).withMessage('Invalid Old Password!').run(req);
    await check('npass').exists().trim().isLength({ min: 8, max: 20 }).withMessage('Min & Max Password Length is 8 & 20!').run(req);
    await check('cpass').exists().trim().equals(req.body.npass).withMessage('Passwords don\'t match!').run(req);

    try {
        // Check for validation errors
        const errs = validationResult(req); 
        if(!errs.isEmpty()) {
            const err = new Error('Validation Failed!');
            err.statusCode = 422;
            err.data = errs.array();
            throw err;
        }

        // Posted data
        const opass = req.body.opass;
        const npass = req.body.npass;

        // Userid
        const userInfo = req.userInfo;
        const userid = userInfo.id;

        // Fetch old pass
        const storedPass = await sequelize.query('SELECT pass FROM users WHERE id = ?',
            {
                replacements: [userid],
                type: QueryTypes.SELECT,
                mapToModel: User
            }
        );
        if(storedPass.length == 0) {
            const err = new Error('Unauthorized!');
            err.statusCode = 401;
            throw err;
        }

        // Compare old pass to req pass
        const match = await bcrypt.compare(opass, storedPass[0]['pass']);
         
        if(match) {
            // Create new hash
            const nHash = await bcrypt.hash(npass, 12);

            // Update new pass
            const [op, affected] = await sequelize.query(
                'UPDATE users SET pass = ? WHERE id = ?',
                {
                    replacements: [nHash, userid],
                    type: QueryTypes.UPDATE,
                    mapToModel: User
                }
            );
            
            if(affected == 1) {
                // Get userInfo
                const userObj = await User.findOne({ where: { id: userid } });
                
                // Create new token
                const tokenObj = new Token();
                const token = await tokenObj.createAccessToken(userObj);

                // Add prev tokens to blacklist
                tokenObj.addTokenBlacklist(userid).catch(e => { console.log(e); });

                // Return object
                return {
                    msg: 'success',
                    token: token,
                    expiresIn: '90'
                };
               
            }
            else {
                const err = new Error('Error Updating Password!');
                throw err;
            }
        }
        else {
            const err = new Error('Invalid Old Password!');
            throw err;
        }

    } catch(err) {
        if(!err.statusCode)
            err.statusCode = 500;
        throw err;
    }
}

exports.forgetPassHelper = async (req) => {
    if(req.userInfo) {
        const err = new Error("Not Allowed!");
        err.statusCode = 401;
        throw err;
    }

    await check('mail').exists().trim().isEmail().normalizeEmail().withMessage('Invalid Email!').run(req);

    try {
        const errs = validationResult(req);
        if(!errs.isEmpty()) {
            const err = new Error('Validation Failed!');
            err.statusCode = 422;
            err.data = errs.array();
            throw err;
        }

        // Email 
        const mail = req.body.mail;

        // Check if email exists
        const mailExist = await User.findOne({ where: { mail: mail, status: 1 } });
        if(!mailExist) {
            const err = new Error('Email doesn\'t Exist!');
            err.statusCode = 422;
            throw err;
        }

        // Get userid
        const uid = mailExist.dataValues.id;

        // Create random bytes
        const buffer = crypto.randomBytes(6);
        const rand = buffer.toString('hex');
        
        // Create expiration for 10 min
        const exp = Math.floor((new Date().getTime() / 1000) + 600);

        // Save 
        const update = await sequelize.query('UPDATE user_info SET verify = ?, verify_exp = ? WHERE uid = ?',
        {
            replacements: [rand, exp, uid],
            type: QueryTypes.UPDATE,
            mapToModel: User_Info
        });
        // ^ will return two fileds in array [result metadata, no of affected rows]

        if(update[1] != 1) {
            // Insert
            await User_Info.create({
                uid: uid,
                verify: rand,
                verify_exp: exp
            });
        }

        // Send Email
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

        // return object
        return {
            msg: 'Success'
        };

    } catch(err) {
        if(!err.statusCode)
            err.statusCode = 500;
        throw err;
    }
}

exports.resetPassHelper = async(req) => {
    if(req.userInfo) {
        const err = new Error('Not Allowed!');
        err.statusCode = 401;
        throw err;
    }

    await check('token').exists().trim().isLength({ min: 12, max: 12 }).withMessage('Link has Expired').isAlphanumeric().withMessage('Link has Expired').run(req);
    await check('pass').exists().trim().isLength({ min: 8, max: 20 }).withMessage('Min & max Password length is 8 and 20').run(req);

    try {
        const errs = validationResult(req);
        if(!errs.isEmpty()) {
            const err = new Error('Validation Failed!');
            err.statusCode = 422;
            err.data = errs.array();
            throw err;
        }

        // Token
        const verifyToken = req.body.token;

        // Expiration
        const currTime = Math.floor(new Date().getTime() / 1000);

        // Hash pass
        const hash = await bcrypt.hash(req.body.pass, 12);

        // Update
        const update = await sequelize.query('UPDATE users AS u INNER JOIN user_info as ui ON u.id = ui.uid SET u.pass = ?, ui.verify_exp = ? WHERE ui.verify = ? AND ui.verify_exp > ? AND u.status = 1', {
            replacements: [hash, currTime, verifyToken, currTime],
            type: QueryTypes.UPDATE
        });

        if(update[1] != 2) {
            const err = new Error('Oops! The reset link has expired, please request a fresh link!');
            err.statusCode = 422;
            throw err;
        }

        // Get userId
        const user_info_obj = await User_Info.findOne({ where: { verify: verifyToken } });
        const userid = user_info_obj.dataValues.uid;

        // Add prev tokens to blacklist
        const tokenObj = new Token();
        tokenObj.addTokenBlacklist(userid, 1).catch(e => { console.log(e); });

        // return object
        return {
            msg: "Success"
        };
    }
    catch(err) {
        if(!err.statusCode)
            err.statusCode = 500;
        throw err;
    }
}

exports.formdataHelper = async (req) => {
    
    // Get countries from global settings
    const countries = App_Settings.countries;
    
    let returnVal = [];

    for(let c in countries) {
        let tmp = {};
        tmp.id = +c;
        tmp.code = countries[c][0];
        tmp.name = countries[c][1];
        tmp.tel = countries[c][2];

        returnVal.push(tmp);
    }
    
    // Return 
    return {
        countries: returnVal
    };
}