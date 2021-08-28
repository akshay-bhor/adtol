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
const Btns = require("../../../models/btn");
const Settings = require("../../../models/settings");
const sizeOf = require('image-size');
const { App_Settings } = require("../../../common/settings");
const User_Banners = require("../../../models/user_banners");

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

exports.manageCampaignHelper = async (req) => {
    if(!req.userInfo) {
        const err = new Error('Not Allowed!');
        err.statusCode = 401;
        throw err;
    }

    await check('campaign_name').exists().trim().escape().isString().notEmpty().withMessage('Campaign Name is required').run(req);
    await check('campaign_type').exists().trim().escape().isInt().notEmpty().withMessage('Invalid Campaign Type').run(req);
    await check('title').exists().trim().escape().isString().notEmpty().withMessage('Title is required').run(req);
    await check('desc').exists().trim().escape().isString().notEmpty().withMessage('Description is required').run(req);
    await check('url').exists().trim().escape().notEmpty().withMessage('URL is required').isURL().withMessage('URL is invalid').run(req);
    if(req.body.banners) await check('banners').exists().trim().escape().isString().notEmpty()
    .withMessage('Please select atleast 1 banner').custom(bannerValidation).run(req);
    await check('category').exists().trim().escape().isString().notEmpty().withMessage('Category is required').custom(adTargetingValidation).run(req);
    await check('country').exists().trim().escape().isString().notEmpty().withMessage('Country is required').custom(adTargetingValidation).run(req);
    await check('device').exists().trim().escape().isString().notEmpty().withMessage('Device is required').custom(adTargetingValidation).run(req);
    await check('os').exists().trim().escape().isString().notEmpty().withMessage('OS is required').custom(adTargetingValidation).run(req);
    await check('browser').exists().trim().escape().isString().notEmpty().withMessage('Browser is required').custom(adTargetingValidation).run(req);
    await check('language').exists().trim().escape().isString().notEmpty().withMessage('Language is required').custom(adTargetingValidation).run(req);
    await check('day').exists().trim().escape().isString().notEmpty().withMessage('Days are required').custom(adTargetingValidation).run(req);
    await check('timezone').exists().trim().isString().notEmpty().withMessage('Timezone is required').custom(timezoneValidation).run(req);
    if(req.body.btn) await check('btn').exists().trim().escape().isInt().notEmpty().withMessage('Invalid Button').custom(btnValidation).run(req);
    await check('cpc').exists().trim().escape().isFloat().notEmpty().withMessage('CPC is required').custom(adSettingsValidation).run(req);
    await check('adult').exists().trim().escape().isInt().notEmpty().withMessage('Adult is required')
    .custom(val => {
        if(val == 0 || val == 1) return true;
        else throw new Error('Invalid selection for Adult');
    }).run(req);
    await check('budget').exists().trim().escape().isFloat().notEmpty().withMessage('Budget is required').custom(adSettingsValidation).run(req);
    await check('daily_budget').exists().trim().escape().isFloat().notEmpty().withMessage('Daily Budget is required').custom(adSettingsValidation).run(req);
    await check('run').exists().trim().escape().isInt().notEmpty().withMessage('Run is required')
    .custom(val => {
        if(val == 1 || val == 2) return true;
        else throw new Error('Invalid selection for run');
    }).run(req);
    
    try {
        // Get type => campaign or pop
        const reqType = req.query.type;

        if(reqType !== 'campaign' && reqType !== 'pop') {
            const err = new Error('Something went wrong, try again!');
            throw err;
        }

        const errs = validationResult(req); 
        if(!errs.isEmpty()) {
            const err = new Error('Validation Failed!');
            err.statusCode = 422;
            err.data = errs.array();
            throw err;
        }

        // Edit or create new
        const manage = req.manage;

        const editCampId = req.params?.campid || null;

        return 'end';

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

        await User_Banners.bulkCreate(imageUploadList);

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
                type: campaign.dataValues.name,
                icon: campaign.dataValues.icon
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
            if(+value < +web_settings.dataValues.min_cpc) 
                throw new Error(`Min CPC is $${web_settings.dataValues.min_cpc}`);
        }
        if(path === 'budget') {
            if(+value < +web_settings.dataValues.min_budget) 
                throw new Error(`Min Budget is $${web_settings.dataValues.min_budget}`);
        }
        if(path === 'daily_budget') {
            if(+value < +web_settings.dataValues.min_daily_budget) 
                throw new Error(`Min Daily Budget is $${web_settings.dataValues.min_daily_budget}`);
        }

        return true;
    } catch (err) {
        throw new Error(err.message);
    }
}

const bannerValidation = async (value, { req }) => {
    try {
        const values = value.split(',');

        const user_banners = await User_Banners.findAll({ where: { uid: req.userInfo.id } });

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