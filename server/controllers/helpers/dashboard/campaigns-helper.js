const { QueryTypes } = require("sequelize");
const sequelize = require("../../../utils/db");
const { tinify, extractHostname } = require('../../../common/util');
// const Campaign_types = require("../../../models/campaign_types");
const Campaign_types = require("../../../models/campaign_types");
const User = require("../../../models/users");
// const User = require("../../../models/users");
const Banner_sizes = require('../../../models/banner_sizes')
const { check, validationResult } = require("express-validator");
const { uploadImageS3 } = require("../../../common/upload-s3");
const { v4: uuidv4 } = require('uuid');
const he = require('he');
const psl = require('psl');
const Banners = require("../../../models/banners");
const Timezones = require("../../../models/timezones");
const Btns = require("../../../models/btn");
const Settings = require("../../../models/settings");
const sizeOf = require('image-size');
const { App_Settings } = require("../../../common/settings");
const User_Banners = require("../../../models/user_banners");
const Ads = require('../../../models/ads')
const Banner_Sizes = require("../../../models/banner_sizes");
const Campaigns = require("../../../models/campaigns");
const Pops = require('../../../models/pops')
const Devices = require("../../../models/devices");
const Os = require("../../../models/os");
const Browsers = require("../../../models/browsers");
const Views = require('../../../models/views');
const { sendCampaignCreatedMail } = require("../../../common/sendMails");

exports.campaignsHelper = async(req) => {
    if(!req.userInfo) {
        const err = new Error('Not Allowed!');
        err.statusCode = 401;
        throw err;
    }

    try {
        // Userid
        const userid = req.userInfo._id;

        // Get all user info
        const userInfo = await User.findOne({ _id: userid });

        // Get campaign types
        const campTypes = await Campaign_types.find();

        // const campaigns = await sequelize.query('SELECT id, campaign_title, campaign_type, cpc, views, clicks, pops, budget, budget_rem, today_budget, today_budget_rem, spent, adult, run, status, pro FROM campaigns WHERE uid = ? AND status != 4',
        // {
        //     type: QueryTypes.SELECT,
        //     replacements: [userid]
        // });
        const campaigns = await Campaigns.find({uid:userid,status:{$ne:4}},{
            campaign_title:1,
            campaign_type:1,
            cpc:1,
            views:1,
            clicks:1,
            pops:1,
            budget:1,
            budget_rem:1,
            today_budget:1,
            today_budget_rem:1,
            spent:1,
            adult:1,
            run:1,
            status:1,
            pro:1
        });

        const tcampaigns = [];
        campaigns.forEach(data => {
            let campData = {};
            campData.id = data._id;
            campData.name = he.decode(data.campaign_title);
            campData.cpc = data.cpc;
            campData.views = data.views;
            campData.clicks = data.clicks;
            campData.pops = data.pops;
            campData.budget = parseFloat(data.budget).toFixed(2);
            campData.budget_rem = parseFloat(data.budget_rem).toFixed(2);
            campData.daily_budget = parseFloat(data.today_budget).toFixed(2);
            campData.daily_budget_rem = parseFloat(data.today_budget_rem).toFixed(2);
            campData.cost = data.spent.toFixed(2);
            if(data.adult == 1)
                campData.adult = true;
            else
                campData.adult = false;
            campData.cstatus = data.run;
            campData.status = data.status;
            campData.isPro = data.pro;
            // Campaign type
            if(data.campaign_type == 0) {
                campData.campaign_type = 'Pop';
            } else {
                campTypes.forEach(c => {
                    if(c._id.equals(data.campaign_type)) {
                        campData.campaign_type = c.name;
                    }
                })
            }

            tcampaigns.push(campData);
        });

        const campaignData = tcampaigns;

        // Return
        return {
            data: campaignData,
            max_budget: userInfo.ad_balance
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
        // const campaigns = await sequelize.query('SELECT c.id, a.id as adid, c.bot, c.status, a.type, c.adult, c.run, c.budget_rem, c.today_budget_rem FROM campaigns c INNER JOIN ads a ON c.id = a.campaign_id WHERE c.uid = ? AND c.id = ? AND c.status != 4', {
        //     type: QueryTypes.SELECT,
        //     replacements: [userid, campId]
        // });
        const campaigns = await Campaigns.find({_id:campId,status:{$ne:4}}).populate('ads');
        if(campaigns.length == 0) {
            throw new Error('Not Allowed!');
        }

        let i = 0;
        for(let data of campaigns) {
            let id = data._id;
            let bot = data.bot;
            let status = data.status;
            let type = data.type;
            let adult = data.adult;
            let run = data.run;
            let ad_id = data.ads[0]._id;
            let budget_rem = data.budget_rem;
            let today_budget_rem = data.today_budget_rem;
            let nrun;
            let nstatus;

            if(run == 3 && action == 'run') {
                const err = new Error('Already Running!');
                err.statusCode = 422;
                throw err;
            }

            // Construct new hash
            const camp_budget_rem = (budget_rem + today_budget_rem);
            if(action == 'run') nrun = 1;
            else if(action == 'pause') nrun = 2;
            else nrun = run;
            if(action == 'delete') {
                nstatus = 4;
                budget_rem = 0;
                today_budget_rem = 0;
            }
            else nstatus = status;
            const str = `0|${+nstatus}|${+type}|${+adult}|${+nrun}`;
            const match_hash = tinify(str);

            // const ts = await sequelize.transaction();
            try {
                // Update
                // const update = await sequelize.query('UPDATE ads a, campaigns c SET c.status = ?, c.run = ?, c.budget_rem = ?, c.today_budget_rem = ?, a.match_hash = ? WHERE c.id = ? AND a.id = ?', {
                //     type: QueryTypes.UPDATE,
                //     replacements: [nstatus, nrun, budget_rem, today_budget_rem, match_hash, id, ad_id],
                //     transaction: ts
                // });
                const update_camp = await  Campaigns.updateOne({_id:id},{
                    status:nstatus,
                    run:nrun,
                    budget_rem:budget_rem,
                    today_budget_rem:today_budget_rem
                });
                const update_ads = await Ads.updateOne({_id:id},{
                    match_hash:match_hash
                })
                // If delete deposit amt back
                if(action == 'delete' && i == 0) {
                    // const user_update = await sequelize.query('UPDATE users SET ad_balance = ad_balance + ? WHERE id = ?', {
                    //     type: QueryTypes.UPDATE,
                    //     replacements: [camp_budget_rem, userid]
                    // });
                    const user_update = await User.updateOne({_id:userid},{ad_balance:camp_budget_rem});
                }

                i++;

                await ts.commit();
            } catch (err) { console.log(err);
                await ts.rollback();
                throw new Error('Something went wrong, try again!');
            }
        }

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
        const userid = req.userInfo._id;

        // Budget
        let budget = req.body.budget;
        // Campaign
        const campId = req.params.campid;

        // Get user advertiser balance
        // const ad_bal_query = await sequelize.query('SELECT ad_balance FROM users WHERE id = ? LIMIT 1', {
        //    type: QueryTypes.SELECT,
        //    replacements: [userid]
        // });
        const ad_bal_query = await User.findOne({_id:userid},{ad_balance:1,_id:0})
        const ad_bal = ad_bal_query.ad_balance;

        // Round budget
        budget = Math.round(budget * 100000) / 100000;

        // Validate
        if(budget < 1) {
            const err = new Error('Minimum budget amount should be greater than $1');
            err.statusCode = 422;
            throw err;
        }

        // Get old remaining budget
        // const old_budget_query = await sequelize.query('SELECT budget_rem FROM campaigns WHERE id = ? AND uid = ? LIMIT 1', {
        //     type: QueryTypes.SELECT,
        //     replacements: [campId, userid]
        // });
        const old_budget_query = await Campaigns.findOne({_id:campId,uid:userid}, {budget_rem: 1,_id:0, budget: 1})
        if(!old_budget_query) {
            const err = new Error('Campaign does\'t exist!');
            err.statusCode = 422;
            throw err;
        }
        const old_budget = old_budget_query.budget_rem;

        // Get additional
        const add = (old_budget - budget);

        // Validate
        if((ad_bal + add) < 0) {
            throw new Error('New Budget exceeds available balance!');
        }

        try {
            await Campaigns.findOneAndUpdate({_id:campId}, {$set: {
                    budget_rem: budget,
                    budget: old_budget_query.budget - add
                }});

            await User.findOneAndUpdate({_id:userid}, {$set: {ad_balance: ad_bal_query.ad_balance + add}});

        } catch (err) {
            throw new Error('Something went wrong, try again!');
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

exports.manageCampaignHelper = async (req) => {
    if(!req.userInfo) {
        const err = new Error('Not Allowed!');
        err.statusCode = 401;
        throw err;
    }

    try {
        // Get type => campaign or pop
        const reqType = req.query.type;

        if(reqType !== 'campaign' && reqType !== 'pop') {
            const err = new Error('Something went wrong, try again!');
            throw err;
        }

        // Get required fields
        const requiredFields = [];
        if(reqType === 'campaign') {
            // Get fields
            const campType = +req.body.campaign_type;
            const getFields = await Campaign_types.findOne({
                id: campType
            });

            if(!getFields) {
                throw new Error('Selected Campaign type is Invalid!');
            }

            getFields.dataValues.fields.split(',').forEach(field => requiredFields.push(field));
        }

        if(req.manage === 'edit') await check('campid').exists().trim().escape().isInt().withMessage('Campaign ID is required').run(req);
        await check('campaign_name').exists().trim().escape().isString().notEmpty().withMessage('Campaign Name is required').isLength({ min:3, max:60 }).withMessage('Min and max allowed characters are 3 & 60').run(req);
        if(requiredFields.includes('title')) await check('title').exists().trim().escape().isString().notEmpty().withMessage('Title is required').isLength({ min:3, max:60 }).withMessage('Min and max allowed characters are 3 & 60').run(req);
        if(requiredFields.includes('desc')) await check('desc').exists().trim().escape().isString().notEmpty().withMessage('Description is required').isLength({ min:3, max:300 }).withMessage('Min and max allowed characters are 3 & 300').run(req);
        await check('url').exists().trim().notEmpty().withMessage('URL is required').isURL().withMessage('URL is invalid').run(req);
        if(requiredFields.includes('banner')) await check('banners').exists().withMessage('Please select atleast 1 banner').trim().escape().isString().notEmpty()
          .withMessage('Please select atleast 1 banner').run(req);
        await check('category').exists().trim().escape().isString().notEmpty().withMessage('Category is required').custom(adTargetingValidation).run(req);
        await check('country').exists().trim().escape().isString().notEmpty().withMessage('Country is required').custom(adTargetingValidation).run(req);
        await check('device').exists().trim().escape().isString().notEmpty().withMessage('Device is required').custom(adTargetingValidation).run(req);
        await check('os').exists().trim().escape().isString().notEmpty().withMessage('OS is required').custom(adTargetingValidation).run(req);
        await check('browser').exists().trim().escape().isString().notEmpty().withMessage('Browser is required').custom(adTargetingValidation).run(req);
        await check('language').exists().trim().escape().isString().notEmpty().withMessage('Language is required').custom(adTargetingValidation).run(req);
        await check('day').exists().trim().escape().isString().notEmpty().withMessage('Days are required').custom(adTargetingValidation).run(req);
        await check('timezone').exists().trim().isString().notEmpty().withMessage('Timezone is required').custom(timezoneValidation).run(req);
        if(requiredFields.includes('btn')) await check('btn').exists().trim().escape().isInt().notEmpty().withMessage('Invalid Button').custom(btnValidation).run(req);
        if(requiredFields.includes('follow')) await check('rel').exists().trim().escape().isInt().notEmpty().withMessage('Invalid Follow').custom(val => {
            if(+val !== 0 && +val !== 1 && +val !== 2) throw new Error('Invalid value for Follow');
            else return true;
        }).run(req);
        await check('cpc').exists().trim().escape().isFloat().notEmpty().withMessage('CPC is required').custom(adSettingsValidation).run(req);
        await check('adult').exists().trim().escape().isInt().notEmpty().withMessage('Adult is required')
          .custom(val => {
              if(+val == 0 || +val == 1) return true;
              else throw new Error('Invalid selection for Adult');
          }).run(req);
        await check('budget').exists().trim().escape().isFloat().notEmpty().withMessage('Budget is required').custom(adSettingsValidation).run(req);
        await check('daily_budget').exists().trim().escape().isFloat().notEmpty().withMessage('Daily Budget is required').custom(adSettingsValidation).run(req);
        if(req.body.run) await check('run').exists().trim().escape().isInt().notEmpty().withMessage('Run is required')
          .custom(val => {
              if(val == 1 || val == 2) return true;
              else throw new Error('Invalid selection for run');
          }).run(req);


        const errs = validationResult(req);
        if(!errs.isEmpty()) {
            const err = new Error('Validation Failed!');
            err.statusCode = 422;
            err.data = errs.array();
            throw err;
        }

        // Edit or create new
        const manage = req.manage;
        let campaign_id = req.params?.campid || null;
        const userid = req.userInfo.id;

        // Validate if campaign exists
        let oldCampData = null;
        if(manage === 'edit') {
            oldCampData = await Campaigns.find({ id: campaign_id, uid: userid });
            if(oldCampData.length < 1) {
                const err = new Error('Campaign not found!');
                err.statusCode = 404;
                throw err;
            }
            oldCampData = oldCampData[0];
        }

        // Validate banners
        let banner_ids;
        let user_banners;
        let banner_sizes;
        if(requiredFields.includes('banner')) {
            banner_ids = req.body.banners.split(',').map(d => +d);
            user_banners = await User_Banners.find({  uid: userid });
            bannerValidation(banner_ids, user_banners);
            banner_sizes = await Banner_Sizes.findAll();
        }

        // Check if banners changed
        let bannersChanged = false;
        if(requiredFields.includes('banner') && manage === 'edit') {
            banner_ids = req.body.banners.split(',').map(d => +d);
            let oldBanner_ids = await Banners.find( { campaign_id: campaign_id } );
            oldBanner_ids = oldBanner_ids.map(data => +data.dataValues.banner_id);
            if(banner_ids.length === oldBanner_ids.length) {
                for(let id of banner_ids) {
                    if(!oldBanner_ids.includes(id)) {
                        bannersChanged = true;
                    }
                }
            }
            else {
                bannersChanged = true;
            }
        }

        /**
         * Get request payload
         */
        const campaign_obj = {};
        campaign_obj.campaign_title = req.body.campaign_name;
        campaign_obj.campaign_type = reqType === 'campaign' ? req.body.campaign_type:0;
        campaign_obj.title = req.body.title || null;
        campaign_obj.desc = req.body.desc || null;
        campaign_obj.url = req.body.url;
        campaign_obj.uid = userid;
        // Domain
        const domain = psl.get(extractHostname(req.body.url));
        campaign_obj.domain_hash = tinify(domain);
        campaign_obj.category = req.body.category.split(',').map(s => s.trim()).join('|');
        campaign_obj.device = req.body.device.split(',').map(s => s.trim()).join('|');
        campaign_obj.os = req.body.os.split(',').map(s => s.trim()).join('|');
        campaign_obj.country = req.body.country.split(',').map(s => s.trim()).join('|');
        campaign_obj.browser = req.body.browser.split(',').map(s => s.trim()).join('|');
        campaign_obj.language = req.body.language.split(',').map(s => s.trim()).join('|');
        campaign_obj.day = req.body.day.split(',').map(s => s.trim()).join('|');
        campaign_obj.cpc = req.body.cpc;
        campaign_obj.adult = req.body.adult;
        campaign_obj.timezone = req.body.timezone;
        campaign_obj.rel = req.body.rel || 0;
        campaign_obj.btn = req.body.btn || 0;
        campaign_obj.budget = req.body.budget;
        campaign_obj.budget_rem = (req.body.budget - req.body.daily_budget);
        campaign_obj.today_budget = req.body.daily_budget;
        campaign_obj.today_budget_rem = req.body.daily_budget;
        campaign_obj.spent = 0;
        campaign_obj.run = req.body.run;
        campaign_obj.status = 2;

        const ts = await sequelize.transaction();
        try {
            /**
             * Edit
             */
            if(manage === 'edit' && reqType === 'campaign') {
                // Delete banners
                await Banners.deleteOne( { campaign_id: campaign_id });
                // Delete ads
                await Ads.deleteOne({ campaign_id: campaign_id });
            }

            if(manage === 'create') {
                const res = await Campaigns.create(campaign_obj);
                campaign_id = res.id;

                // Update user ad balance
                const deduct = req.body.budget;
                // const update_ad_bal = await sequelize.query('UPDATE users SET `ad_balance` = `ad_balance` - ? WHERE `id` = ?', {
                //     type: QueryTypes.UPDATE,
                //     replacements: [deduct, userid],
                //     transaction: ts
                // });
                const update_ad_bal = await User.findOne({_id:userid});
                update_ad_bal.ad_balance = update_ad_bal.ad_balance - deduct;
                update_ad_bal.save();
            }
            if(manage === 'edit') {
                // Delete fields fron object
                delete campaign_obj.campaign_type;
                delete campaign_obj.budget;
                delete campaign_obj.budget_rem;
                delete campaign_obj.today_budget_rem;
                delete campaign_obj.spent;
                campaign_obj.run = oldCampData.dataValues.run;
                campaign_obj.status = oldCampData.dataValues.status;
                const new_budget = req.body.budget;

                // Check weather to update status
                if(shouldUpdateStatus(campaign_obj, oldCampData.dataValues) || bannersChanged) {
                    campaign_obj.status = 2;
                }

                // const oldData = await sequelize.query('SELECT u.ad_balance, c.budget_rem from users u INNER JOIN campaigns c ON u.id = c.uid WHERE u.id = ? AND c.id = ?', {
                //     type: QueryTypes.SELECT,
                //     replacements: [userid, campaign_id]
                // });
                const oldData = await Campaigns.find({_id:campaign_id},{_id:0,budget_rem:1}).populate({path:"uid",select:'ad_balance'})

                const old_budget_rem = oldData[0].budget_rem;
                const ad_balance = oldData[0].ad_balance;

                // Get additional
                const add = (old_budget_rem - new_budget);

                // Validate
                if((ad_balance + add) < 0) {
                    throw new Error('New Budget exceeds available balance!');
                }

                // const res = await Campaigns.update(campaign_obj, { where: { id: campaign_id, uid: userid }, transaction: ts });
                const res = await Campaigns.updateOne({ id: campaign_id, uid: userid },campaign_obj);
                // Update ad budget
                // const update_ad_budget = await sequelize.query('UPDATE campaigns SET budget_rem = ?, `budget` = `budget` - ? WHERE id = ? AND uid = ?', {
                //     type: QueryTypes.UPDATE,
                //     replacements: [new_budget, add, campaign_id, userid],
                //     transaction: ts
                // });

                const update_ad_budget_init = await Campaigns.updateOne({_id:userid},{budget_rem:new_budget});
                const update_ad_budget = await Campaigns.findOne({_id:campaign_id,uid:userid});
                update_ad_budget.budget = update_ad_budget.budget - add;
                update_ad_budget.save();

                // Update user ad balance
                // const update_ad_bal = await sequelize.query('UPDATE users SET `ad_balance` = `ad_balance` + ? WHERE `id` = ?', {
                //     type: QueryTypes.UPDATE,
                //     replacements: [add, userid],
                //     transaction: ts
                // });
                const update_ad_bal = await User.findOne({_id:userid});
                update_ad_bal.ad_balance = update_ad_bal.ad_balance + add;
                update_ad_bal.save();
            }

            // Create ad types
            if(reqType === 'campaign') {
                // Insert ads
                const adsArr = createAds(req, campaign_id, banner_ids, user_banners, banner_sizes, campaign_obj);
                const res = await Ads.create(adsArr[0]);
                if(req.body.banners) {
                    // Filter banners
                    const bannersArr = user_banners.filter(banner => {
                        if(banner_ids.includes(banner.dataValues.id)) return true;
                        else return false;
                    })
                      .map(banner => {
                          return ({
                              campaign_id: campaign_id,
                              banner_id: banner.dataValues.id,
                              size: banner.dataValues.size,
                              src: banner.dataValues.src
                          });
                      });
                    // Insert Banners
                    const bRes = await Banners.create(bannersArr);
                }
            }

            if(reqType === 'pop') {
                const ad_type = 5;
                const str = `0|${campaign_obj.status}|${ad_type}|${req.body.adult}|${req.body.run}`;
                const match_hash = tinify(str);

                if(manage === 'create') {
                    const insert = await Ads.create({
                        campaign_id: campaign_id,
                        type: ad_type,
                        match_hash: match_hash
                    });
                }
                if(manage === 'edit') {
                    // const update = await Ads.update({
                    //     match_hash: match_hash
                    // }, {
                    //     where: {
                    //         campaign_id: campaign_id,
                    //         type: ad_type
                    //     },
                    //     transaction: ts
                    // });
                    const update = await Ads.update({ campaign_id : campaign_id,type : ad_type }, {match_hash: match_hash} );
                }
            }

            await ts.commit();
        } catch (err) { console.log(err);
            await ts.rollback();
            throw new Error('Something went wrong, try again');
        }

        // Send Campaign Created/Pending Mail
        if(campaign_obj.status == 2) {
            sendCampaignCreatedMail(req.userInfo.mail, req.userInfo.user, campaign_obj.campaign_title);
        }

        return {
            msg: "success"
        }

    } catch(err) {
        if(!err.statusCode)
            err.statusCode = 500;
        throw err;
    }
}

exports.getCampaignInfoHelper = async (req) => {
    if(!req.userInfo) {
        const err = new Error('Not Allowed!');
        err.statusCode = 401;
        throw err;
    }

    await check('campid').exists().trim().escape().notEmpty().withMessage('Campaign ID is required').run(req);

    try {
        const errs = validationResult(req);

        if(!errs.isEmpty()) {
            const err = new Error('Validation Failed!');
            err.statusCode = 422;
            err.data = errs.array();
            throw err;
        }

        // Req data
        const campaign_id = req.params.campid;
        const userid = req.userInfo._id;

        // const data = await sequelize.query('SELECT b.banner_id as banner_id, a.type as ad_type, c.campaign_title as campaign_name, c.campaign_type, c.title, c.desc, c.url, c.category, c.country, c.device, c.os, c.browser, c.language, c.day, c.timezone, c.rel, c.btn, c.cpc, c.budget_rem as budget, c.today_budget as daily_budget, c.adult FROM campaigns c LEFT JOIN banners b ON c.id = b.campaign_id INNER JOIN ads a ON c.id = a.campaign_id WHERE c.id = ? AND c.uid = ? AND c.status != 4', {
        //     type: QueryTypes.SELECT,
        //     replacements: [campaign_id, userid]
        // });
        // const data = await Banners.find({campaign_id:campaign_id}).populate([{
        //     path:'campaign_id',
        //     model:'Campaigns',
        //     populate:{
        //         path:'ads',
        //         model:'Ads'
        //     }
        // }])

        const data = await Campaigns.findOne({_id:campaign_id, uid: userid}).populate("ads");

        const campaignData = {};

        const banners = await Banners.find({campaign_id: campaign_id}, {banner_id: 1});

        if(!data) {
            const err = new Error('Campaign not found!');
            err.statusCode = 404;
            throw err;
        }

        // const campaignData = data[0];

        // Get banner_ids
        let banner_ids = new Set();
        for(let item of banners) {
            if(item.banner_id !== null) banner_ids.add(item.banner_id);
        }
        banner_ids = Array.from(banner_ids); // [...banner_ids]

        // Ad type
        if(data.ads[0].type === '5') campaignData.ad_type = 'pop';
        else campaignData.ad_type = 'campaign';

        // Modify resposne
        // delete campaignData.banner_id;
        campaignData.title = data.title ? he.decode(data.title):'';
        campaignData.campaign_name = he.decode(data.campaign_title);
        campaignData.desc = data.desc ? he.decode(data.desc):'';
        campaignData.banners = banner_ids;
        campaignData.category = data.category.split('|').map(d => +d);
        campaignData.country = data.country.split('|').map(d => +d);
        campaignData.device = data.device.split('|').map(d => +d);
        campaignData.os = data.os.split('|').map(d => +d);
        campaignData.browser = data.browser.split('|').map(d => +d);
        campaignData.language = data.language.split('|').map(d => +d);
        campaignData.day = data.day.split('|').map(d => +d);

        console.log(campaignData)

        return campaignData;

    } catch (err) {
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

        await User_Banners.create(imageUploadList);

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

exports.trafficEstimationHelper = async (req) => {
    if(!req.userInfo) {
        const err = new Error('Not Allowed!');
        err.statusCode = 401;
        throw err;
    }

    await check('category').exists().trim().escape().isString().notEmpty().withMessage('Category is required').custom(adTargetingValidation).run(req);
    await check('country').exists().trim().escape().isString().notEmpty().withMessage('Country is required').custom(adTargetingValidation).run(req);
    await check('device').exists().trim().escape().isString().notEmpty().withMessage('Device is required').custom(adTargetingValidation).run(req);
    await check('os').exists().trim().escape().isString().notEmpty().withMessage('OS is required').custom(adTargetingValidation).run(req);
    await check('browser').exists().trim().escape().isString().notEmpty().withMessage('Browser is required').custom(adTargetingValidation).run(req);
    await check('language').exists().trim().escape().isString().notEmpty().withMessage('Language is required').custom(adTargetingValidation).run(req);
    await check('adult').exists().trim().escape().isInt().notEmpty().withMessage('Adult is required')

    console.log(req.body)

    try {
        const errs = validationResult(req);
        if(!errs.isEmpty()) {
            const err = new Error('Validation Failed!');
            err.statusCode = 422;
            err.data = errs.array();
            throw err;
        }

        // Get data
        const categories = req.body.category.split(',');
        const countries = req.body.country.split(',');
        const devices = req.body.device.split(',');
        const os = req.body.os.split(',');
        const browsers = req.body.browser.split(',');
        const languages = req.body.language.split(',');
        const adult = +req.body.adult || 0;
        // const campaign_type = isNaN(+req.body.campaign_type) ? 0:+req.body.campaign_type;
        const campaign_type = req.body.campaign_type;

        // Previous 30 day unix date
        const today = new Date().toISOString().slice(0, 10);
        const today_unix = Math.floor(new Date(today).getTime() / 1000);
        const prevDate = Math.floor(today_unix - (60*60*24*30));

        // Get impressions estimate
        // const campEst = await sequelize.query(`SELECT COUNT(id) as impressions, MAX(ad_cpc) as maxCpc, AVG(ad_cpc) as avgCpc FROM views
        //     WHERE adult = ${adult} AND
        //     campaign_type = ${campaign_type} AND
        //     category IN (${categories}) AND
        //     country IN (${countries}) AND
        //     device IN (${devices}) AND
        //     os IN (${os}) AND
        //     browser IN (${browsers}) AND
        //     language IN (${languages}) AND
        //     day_unix >= ${prevDate}`, {
        //     type: QueryTypes.SELECT
        // });
        const campEst = await Views.aggregate([
            {
                // $match: {"$and":[
                //     {adult: adult},
                //     // {campaign_type:campaign_type},
                //     // {category: { "$in": categories }},
                //     // {country: { "$in": countries }},
                //     // {device:{ "$in": devices }},
                //     // {os:{ "$in": os }},
                //     // {browser:{ "$in": browsers }},
                //     // {language:{ "$in": languages }},
                //     // {day_unix:{$gte:prevDate}}
                // ]}
            },
            {$group:{
                    // impressions: {$sum:"$_id"},
                    maxCpc:{$max:"$ad_cpc"},
                    // avgCpc:{$avg:"$ad_cpc"},
                    _id:"$ad_cpc"
                }},
        ]);

        throw new Error(JSON.stringify(campEst));

        // Get popups estimate
        // const popEst = await sequelize.query(`SELECT COUNT(id) as pops, MAX(ad_cpc) as maxCpc, AVG(ad_cpc) as avgCpc FROM pops
        //     WHERE adult = ${adult} AND
        //     category IN (${categories}) AND
        //     country IN (${countries}) AND
        //     device IN (${devices}) AND
        //     os IN (${os}) AND
        //     browser IN (${browsers}) AND
        //     language IN (${languages}) AND
        //     day_unix >= ${prevDate}`, {
        //     type: QueryTypes.SELECT,
        // });
        const popEst = Pops.aggregate([{
            $match: {"$and":[{adult: adult},{campaign_type:campaign_type},{category:categories},{country:countries},{device:devices},{os:os},{browser:browsers},{language:languages},{day_unix:{$gte:prevDate}}]}
        },
            {$group:{
                    pops: {$sum:"$_id"},
                    maxCpc:{$max:"$ad_cpc"},
                    avgCpc:{$avg:"$ad_cpc"},
                    _id:"$_id"
                }},
        ]);

        const impressions = Math.floor(campEst[0].impressions / 30);
        const maxCampCpc = campEst[0].maxCpc;
        const avgCampCpc = campEst[0].avgCpc;
        const pops = Math.floor(popEst[0].pops / 30);
        const maxPopCpc = popEst[0].maxCpc;
        const avgPopCpc = popEst[0].avgCpc;

        const minClicks = Math.floor(impressions * 0.0025);
        const maxClicks = Math.floor(impressions * 0.01);

        const campaign = {
            impressions: impressions,
            max_cpc: maxCampCpc,
            avg_cpc: avgCampCpc,
            min_clicks: minClicks,
            max_clicks: maxClicks
        }

        const pop = {
            pops: pops,
            max_cpc: maxPopCpc,
            avg_cpc: avgPopCpc,
        }

        return {
            campaign,
            pop
        }

    } catch (err) {
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
        const res = await Campaign_types.find();

        const result = [];

        res.forEach(campaign => {
            result.push({
                id: campaign._id,
                type: campaign.name,
                desc: campaign.desc,
                fields: campaign.fields,
                icon: campaign.icon
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

        result.sort();

        return result;

    } catch(err) {
        if(!err.statusCode)
            err.statusCode = 500;
        throw err;
    }
}

exports.getCampaignBannersHelper = async (req) => {
    if(!req.userInfo) {
        const err = new Error('Not Allowed!');
        err.statusCode = 401;
        throw err;
    }

    try {
        const userid = req.userInfo.id;

        // Get All Banners
        // const user_banners = await sequelize.query('SELECT id, size, src FROM user_banners WHERE uid = ? ORDER BY id DESC', {
        //     type: QueryTypes.SELECT,
        //     replacements: [userid]
        // });
        const user_banners = await User_Banners.find({_id:userid},{size:1})

        // Get All Banner Sizes
        // const banner_sizes = await sequelize.query('SELECT id, size from banner_sizes', {
        //     type: QueryTypes.SELECT
        // });
        const banner_sizes = await Banner_sizes.find({},{size:1});

        const response = [];

        user_banners.forEach(item => {
            const { size } = banner_sizes.filter(banner => banner.id === item.size)[0];

            response.push({
                id: item.id,
                size,
                src: `${process.env.CLOUDFRONT_S3_ORIGIN}${item.src}`
            });
        });

        return response;

    } catch (err) {
        if(!err.statusCode)
            err.statusCode = 500
        throw err;
    }
}

exports.getCampaignFormDataHelper = async (req) => {
    if(!req.userInfo) {
        const err = new Error('Not Allowed!');
        err.statusCode = 401;
        throw err;
    }

    try {
        const res = await Promise.all([
            Devices.find(),
            Os.find(),
            Browsers.find(),
            Timezones.find(),
            Btns.find(),
            Settings.find()
        ]);

        const devices = [];
        const os = [];
        const browsers = [];
        const timezones = [];
        const btns = [];
        const settings = {};

        res[0].forEach(item => {
            devices.push({
                id: item._id,
                name: item.name
            });
        });

        res[1].forEach(item => {
            const version = item.version;
            let osName = `${item.name} ${version} and up`;
            if(!version || version == 0) osName = item.name;
            os.push({
                id: item._id,
                name: osName
            });
        });

        res[2].forEach(item => {
            browsers.push({
                id: item._id,
                name: item.name
            });
        });

        res[3].forEach(timezone => {
            timezones.push(timezone.zone);
        });
        timezones.sort();

        res[4].forEach(item => {
            btns.push({
                id: item._id,
                name: item.name
            });
        });

        res[5].forEach(item => {
            settings.min_cpc = item.min_cpc;
            settings.min_pop_cpc = item.min_pop_cpc;
            settings.min_budget = item.min_budget;
            settings.min_daily_budget = item.min_daily_budget;
        });

        return {
            devices,
            os,
            browsers,
            timezones,
            btns,
            settings
        };

    } catch(err) {
        if(!err.statusCode)
            err.statusCode = 500;
        throw err;
    }
}

const createAds = (req, campaign_id, banner_ids, user_banners, banner_sizes, data) => {
    /**
     * Chekout website-helper for more info
     */
      // Text ad
    const adsArr = [];
    if(req.body.title && req.body.desc) {
        const ad_type = 1;
        const str = `0|${+data.status}|${+ad_type}|${+data.adult}|${+data.run}`;
        let match_hash = tinify(str);
        adsArr.push({
            campaign_id: campaign_id,
            type: ad_type,
            match_hash: match_hash
        });
    }
    // Banners
    if(req.body.banners) {
        const ad_type = 2;
        const str = `0|${+data.status}|${+ad_type}|${+data.adult}|${+data.run}`;
        let match_hash = tinify(str);
        adsArr.push({
            campaign_id: campaign_id,
            type: ad_type,
            match_hash: match_hash
        });
    }
    // Native
    if(req.body.banners) {
        /**
         * Get native banners ids
         */
        const native_banner_ids = [];
        const native_banner_sizes = ['300x280', '300x150', '300x250'];
        for(let banner_size of banner_sizes) {
            const size = banner_size.dataValues.size;
            if(native_banner_sizes.includes(size)) {
                native_banner_ids.push(banner_size.dataValues.id);
            }
        }

        /**
         * cross check stored banner id with banner_sizes ids
         * */
        let has_native = false;
        for(let banner of user_banners) { // banner.dataValues.size is sizeid
            if(native_banner_ids.includes(banner.dataValues.size) && banner_ids.includes(banner.dataValues.id)) {
                has_native = true;
                break;
            }
        }

        if(has_native) {
            const ad_type = 3;
            const str = `0|${+data.status}|${+ad_type}|${+data.adult}|${+data.run}`;
            let match_hash = tinify(str);
            adsArr.push({
                campaign_id: campaign_id,
                type: ad_type,
                match_hash: match_hash
            });
        }
    }
    // Widget
    if(req.body.banners) {
        let widget_banner_id;
        for(let banner_size of banner_sizes) {
            if(banner_size.dataValues.size === '300x250') {
                widget_banner_id = banner_size.dataValues.id;
            }
        }

        let has_widget = false;
        for(let user_banner of user_banners) {
            if(user_banner.dataValues.size === widget_banner_id && banner_ids.includes(user_banner.dataValues.id)) {
                has_widget = true;
                break;
            }
        }

        if(has_widget) {
            const ad_type = 4;
            const str = `0|${+data.status}|${+ad_type}|${+data.adult}|${+data.run}`;
            let match_hash = tinify(str);
            adsArr.push({
                campaign_id: campaign_id,
                type: ad_type,
                match_hash: match_hash
            });
        }
    }

    return adsArr;
}

const adTargetingValidation = (value, { req, location, path }) => {
    if(value == 0) return true; // 0 is all values

    if(path !== 'day') {
        let data;
        if(path === 'category') data = App_Settings.categories;
        if(path === 'browser') data = App_Settings.browsers;
        if(path === 'device') data = App_Settings.devices;
        if(path === 'language') data = App_Settings.languages;
        if(path === 'country') data = App_Settings.countries;
        if(path === 'os') data = App_Settings.os;

        const values = value.split(',');
        const compareData = Object.keys(data).map(d => +d);

        for(let val of values) {
            if(!compareData.includes(+val)) {
                throw new Error(`Invalid selection for ${path}`);
            }
        }
        return true;
    }
    else {
        const values = value.split(',');

        for(let val of values) {
            if(+val < 1 || +val > 7) {
                throw new Error(`Invalid selection for days`);
            }
        }
        return true;
    }
}

const timezoneValidation = async (value) => {
    try {
        const timzones = await Timezones.findAll();

        const tzArr = [];
        for(let tz of timzones) {
            tzArr.push(tz.dataValues.zone);
        }

        if(!tzArr.includes(value)) {
            throw new Error('Selected timezone does not exist');
        }

        return true;

    } catch (err) {
        throw new Error(err.message);
    }
}

const btnValidation = async (value) => {
    try {
        const btns = await Btns.findAll();

        const btnArr = [];
        for(let btn of btns) {
            btnArr.push(btn.dataValues.id);
        }

        if(!btnArr.includes(+value)) {
            throw new Error('Selected button does not exist');
        }

        return true;

    } catch (err) {
        throw new Error(err.message);
    }
}

const adSettingsValidation = async (value, { req, location, path }) => {
    try {
        const web_settings = await Settings.findOne();

        if(path === 'cpc') {
            if(req.query.type === 'campaign' && +value < +web_settings.dataValues.min_cpc) {
                throw new Error(`Min CPC is $${web_settings.dataValues.min_cpc}`);
            }
            if(req.query.type === 'pop' && +value < +web_settings.dataValues.min_pop_cpc) {
                throw new Error(`Min CPC is $${web_settings.dataValues.min_pop_cpc}`);
            }
            if(req.body.rel === 1 && +value < (+web_settings.dataValues.min_cpc + 0.001)) {
                throw new Error(`Min CPC is $${(+web_settings.dataValues.min_cpc + 0.001)}`);
            }
        }
        if(path === 'budget') {
            if(+value < +web_settings.dataValues.min_budget) {
                throw new Error(`Min Budget is $${web_settings.dataValues.min_budget}`);
            }
            if(req.manage === 'create') {
                // Check user balance
                const user_info = await User.findOne({ where: { id: req.userInfo.id } });
                if(+value > user_info.dataValues.ad_balance) {
                    throw new Error(`Campaign budget can't be over available balance - $${user_info.dataValues.ad_balance}`);
                }
            }
        }
        if(path === 'daily_budget') {
            if(+value < +web_settings.dataValues.min_daily_budget) {
                throw new Error(`Min Daily Budget is $${web_settings.dataValues.min_daily_budget}`);
            }
            if(+value > +req.body.budget) {
                throw new Error(`Daily Budget can't be greater than campaign budget`);
            }
        }

        return true;
    } catch (err) {
        throw new Error(err.message);
    }
}

const bannerValidation = (values, user_banners) => {
    try {
        const banners = [];

        for(let banner of user_banners) {
            banners.push(+banner.dataValues.id);
        }

        for(let val of values) {
            if(!banners.includes(+val)) {
                throw new Error("Selected banners doesn't exist");
            }
        }

        return true;
    } catch (err) {
        throw new Error(err.message);
    }
}

const shouldUpdateStatus = (campData, oldData) => {
    if(
      campData.title == oldData.title &&
      campData.desc == oldData.desc &&
      campData.url == oldData.url &&
      campData.adult == oldData.adult
    ) {
        return false
    }
    return true;
}
