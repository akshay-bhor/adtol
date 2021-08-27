const { QueryTypes } = require("sequelize");
const sequelize = require("../../../utils/db");
const { tinify } = require('../../../common/util');
const Campaign_types = require("../../../models/campaign_types");
const User = require("../../../models/users");
const { check, validationResult } = require("express-validator");
const { uploadImageS3 } = require("../../../common/upload-s3");
const { v4: uuidv4 } = require('uuid');
const Banners = require("../../../models/banners");
const Timezones = require("../../../models/timezones");
const sizeOf = require('image-size');

exports.campaignsHelper = async(req) => {
    if(!req.userInfo) {
        const err = new Error('Not Allowed!');
        err.statusCode = 401;
        throw err;
    }

    try {
        // Userid
        const userid = req.userInfo.id;

        // Get all user info
        const userInfo = await User.findOne({ where: { id: userid } });

        // Get campaign types
        const campTypes = await Campaign_types.findAll();

        const campaigns = await sequelize.query('SELECT id, campaign_title, campaign_type, cpc, views, clicks, pops, budget, budget_rem, spent, adult, run, status, pro FROM campaigns WHERE uid = ? AND status != 4',
        {
            type: QueryTypes.SELECT,
            replacements: [userid]
        });
        const tcampaigns = [];
        campaigns.forEach(data => {
            let campData = {};
            campData.id = data.id;
            campData.name = data.campaign_title;
            campData.cpc = data.cpc;
            campData.views = data.views;
            campData.clicks = data.clicks;
            campData.pops = data.pops;
            campData.budget = data.budget;
            campData.budget_rem = data.budget_rem;
            campData.cost = data.cost;
            if(data.adult == 1)
                campData.adult = true;
            else    
                campData.adult = false;
            campData.cstatus = data.run;
            campData.status = data.status;
            campData.isPro = data.pro;
            // Campaign type
            if(data.campaign_type == 0) {
                campData.campaign_type = 'pop';
            }
            else {
                campTypes.forEach(c => {
                    if(c.dataValues.id == data.campaign_type) {
                        campData.campaign_type = c.dataValues.name;
                    }
                })
            }

            tcampaigns.push(campData);
        });

        const campaignData = tcampaigns;

        // Return
        return {
            data: campaignData,
            max_budget: userInfo.dataValues.ad_balance
        };
        
    } catch(err) {
        if(!err.statusCode)
            err.statusCode = 500;
        throw err;
    }
}

exports.changeStatusHelper = async (req) => {
    if(!req.userInfo) {
        const err = new Error('Not Allowed!');
        err.statusCode = 401;
        throw err;
    }

    try {
        // Get action
        const action = req.body.status;

        if(action != 'run' && action != 'pause' && action != 'delete') {
            const err = new Error('Invalid Action!');
            err.statusCode = 422;
            throw err;
        }

        // Get campaign id
        const campId = req.params.campid;

        // Userid
        const userid = req.userInfo.id;

        // Get campaigns
        const campaigns = await sequelize.query('SELECT c.id, a.id as adid, c.bot, c.status, a.type, c.adult, c.run FROM campaigns c INNER JOIN ads a ON c.id = a.campaign_id WHERE c.uid = ? AND c.id = ? AND c.status = 1', {
            type: QueryTypes.SELECT,
            replacements: [userid, campId]
        });
        if(campaigns.length == 0) {
            throw new Error('Not Allowed!');
        }

        campaigns.forEach(data => {
            let id = data.id;
            let bot = data.bot;
            let status = data.status;
            let type = data.type;
            let adult = data.adult;
            let run = data.run;
            let ad_id = data.adid;
            let nrun;
            let nstatus;

            if(run == 3 && action == 'run') {
                const err = new Error('Already Running!');
                err.statusCode = 422;
                throw err;
            }

            // Construct new hash
            if(action == 'run') nrun = 1;
            else if(action == 'pause') nrun = 2;
            else nrun = run;
            if(action == 'delete') nstatus = 4;
            else nstatus = status;
            const str = '0|'+nstatus+'|'+type+'|'+adult+'|'+nrun;
            const match_hash = tinify(str);

            // Update
            const update = sequelize.query('UPDATE ads a, campaigns c SET c.status = ?, c.run = ?, a.match_hash = ? WHERE c.id = ? AND a.id = ?', {
                type: QueryTypes.UPDATE,
                replacements: [nstatus, nrun, match_hash, id, ad_id]
            });
        });

        // Return
        return {
            'msg': 'success'
        };

    } catch (err) {
        if(!err.statusCode)
            err.statusCode = 500;
        throw err;
    }
}

exports.changeBudgetHelper = async (req) => {
    if(!req.userInfo) {
        const err = new Error('Not Allowed!');
        err.statusCode = 401;
        throw err;
    }

    await check('budget').exists().isDecimal().withMessage('Invalid Budget!').escape().run(req);

    try {
        const errs = validationResult(req); 
        if(!errs.isEmpty()) {
            const err = new Error('Validation Failed!');
            err.statusCode = 422;
            err.data = errs.array();
            throw err;
        }

        // Userid
        const userid = req.userInfo.id;

        // Budget
        let budget = req.body.budget; 
        // Campaign 
        const campId = req.params.campid;

        // Get user advertiser balance
        const ad_bal_query = await sequelize.query('SELECT ad_balance FROM users WHERE id = ? LIMIT 1', {
           type: QueryTypes.SELECT,
           replacements: [userid]
        });
        const ad_bal = ad_bal_query[0].ad_balance;

        // Round budget
        budget = Math.round(budget * 100000) / 100000;   

        // Validate
        if(budget < 1) {
            const err = new Error('Minimum budget amount should be greater than $1');
            err.statusCode = 422;
            throw err;
        }
        if(budget > ad_bal) {
            const err = new Error('Maximum budget exceeds available balance!');
            err.statusCode = 422;
            throw err;
        }

        // Get old remaining budget
        const old_budget_query = await sequelize.query('SELECT budget_rem FROM campaigns WHERE id = ? AND uid = ? LIMIT 1', {
            type: QueryTypes.SELECT,
            replacements: [campId, userid]
        });
        if(old_budget_query.length != 1) {
            const err = new Error('Campaign does\'t exist!');
            err.statusCode = 422;
            throw err;
        }
        const old_budget = old_budget_query[0].budget_rem;

        // Get additional
        const add = (old_budget - budget);

        const ts = await sequelize.transaction();

        try {
            // Update ad budget
            const update_ad_budget = await sequelize.query('UPDATE campaigns SET budget_rem = ?, `budget` = `budget` - ? WHERE id = ? AND uid = ?', {
                type: QueryTypes.UPDATE,
                replacements: [budget, add, campId, userid],
                transaction: ts
            });

            // Update user ad balance
            const update_ad_bal = await sequelize.query('UPDATE users SET `ad_balance` = `ad_balance` + ? WHERE `id` = ?', {
                type: QueryTypes.UPDATE,
                replacements: [add, userid],
                transaction: ts
            });

            await ts.commit();
        } catch (err) {
            await ts.rollback();
        }

        // Return
        return {
            'msg': 'success'
        };

    } catch(err) {
        if(!err.statusCode)
            err.statusCode = 500;
        throw err;
    }
}

exports.uploadBannersHelper = async (req) => {
    if(!req.userInfo) {
        const err = new Error('Not Allowed!');
        err.statusCode = 401;
        throw err;
    }

    try {
        // Userid
        const userid = req.userInfo.id;

        // Images list
        const imageUploadList = [];

        for (let image of req.files) { 
            const uniqueImageName = uuidv4();
            const ext = image.originalname.split('.').pop();
            const finalImageName = uniqueImageName + '.' + ext;
            await uploadImageS3(image.buffer, finalImageName, image.mimetype);

            // Get size
            const {width, height} = sizeOf(image.buffer);
            const dimension = `${width}x${height}`;

            const { id:size } = req.banner_sizes_obj.filter(data => data.size === dimension)[0];

            imageUploadList.push({
                uid: userid,
                size,
                src: finalImageName
            });
        }

        await Banners.bulkCreate(imageUploadList);

        // Return
        return {
            'msg': 'success'
        };
    } catch(err) {
        if(!err.statusCode)
            err.statusCode = 500;
        throw err;
    }
}

exports.getCampaignTypesHelper = async (req) => {
    if(!req.userInfo) {
        const err = new Error('Not Allowed!');
        err.statusCode = 401;
        throw err;
    }

    try {
        const res = await Campaign_types.findAll();

        const result = [];

        res.forEach(campaign => {
            result.push({
                id: campaign.dataValues.id,
                type: campaign.dataValues.name 
            });
        });

        return result;

    } catch(err) {
        if(!err.statusCode)
            err.statusCode = 500;
        throw err;
    }
}

exports.getTimezonesHelper = async (req) => {
    if(!req.userInfo) {
        const err = new Error('Not Allowed!');
        err.statusCode = 401;
        throw err;
    }

    try {
        const res = await Timezones.findAll();

        const result = [];

        res.forEach(timezone => {
            result.push(timezone.dataValues.zone);
        });

        return result;

    } catch(err) {
        if(!err.statusCode)
            err.statusCode = 500;
        throw err;
    }
}