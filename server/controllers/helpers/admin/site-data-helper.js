const Browsers = require("../../../models/browsers");
const Categories = require("../../../models/category");
const Os = require("../../../models/os");
const Timezones = require("../../../models/timezones");
const Banner_Sizes = require("../../../models/banner_sizes");
const Languages = require("../../../models/languages");
const Btns = require("../../../models/btn");
const Campaign_types = require("../../../models/campaign_types");
// const sequelize = require("../../../utils/db");
// const { QueryTypes } = require("sequelize");

exports.getSiteDataHelper = async (req) => {
    if (!req.userInfo || req.userInfo.rank != 1) {
        const err = new Error("Not allowed!");
        err.statusCode = 401;
        throw err;
    }

    try {
        // Get Cats
        const catsData = await Categories.find();
        const cats = catsData.map(data => {
            return {
                id: data._id,
                name: data.name
            }
        });

        // Get OS
        const osData = await Os.find();
        const os = osData.map(data => {
            return {
                id: data._id,
                name: data.name,
                version: data.version
            }
        });

        // Get Browsers
        const browserData = await Browsers.find();
        const browsers = browserData.map(data => {
            return {
                id: data._id,
                name: data.name
            }
        });

        // Get Languages
        const langData = await Languages.find();
        const languages = langData.map(data => {
            return {
                id: data._id,
                name: data.name
            }
        });

        // Get Timezones
        const tzData = await Timezones.find();
        const timezones = tzData.map(data => {
            return {
                id: data._id,
                zone: data.zone
            }
        });

        // Get Banner Sizes
        const bData = await Banner_Sizes.find();
        const banner_sizes = bData.map(data => {
            return {
                id: data._id,
                size: data.size
            }
        });

        // Get Btns
        const btnData = await Btns.find();
        const btns = btnData.map(data => {
            return {
                id: data._id,
                name: data.name
            }
        });

        // Get Btns
        const campTypesData = await Campaign_types.find();
        const campTypes = campTypesData.map(data => {
            return {
                id: data._id,
                name: data.name,
                desc: data.desc,
                fields: data.fields,
                icon: data.icon
            }
        });

        return {
            cats,
            os,
            browsers,
            languages,
            timezones,
            banner_sizes,
            btns,
            campTypes
        }

    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        throw err;
    }
}

exports.addSiteDataHelper = async (req) => {
    if (!req.userInfo || req.userInfo.rank != 1) {
        const err = new Error("Not allowed!");
        err.statusCode = 401;
        throw err;
    }

    try {
        const type = req.query.type;

        if(type == 'category') {
            // Get max id
            // const query = await sequelize.query('SELECT id FROM categories ORDER BY id DESC LIMIT 1', {
            //     type: QueryTypes.SELECT,
            //     mapToModel: Categories
            // });
            // const maxId = query[0].id;
            // const newId = (maxId + 1);

            await Categories.create({
                name: req.body.category
            });
        }

        if(type == 'os') {
            // Get max id
            // const query = await sequelize.query('SELECT id FROM os ORDER BY id DESC LIMIT 1', {
            //     type: QueryTypes.SELECT,
            //     mapToModel: Os
            // });
            // const maxId = query[0].id;
            // const newId = (maxId + 1);

            await Os.create({
                name: req.body.os,
                version: req.body.version
            });
        }

        if(type == 'browser') {
            // Get max id
            // const query = await sequelize.query('SELECT id FROM browsers ORDER BY id DESC LIMIT 1', {
            //     type: QueryTypes.SELECT,
            //     mapToModel: Browsers
            // });
            // const maxId = query[0].id;
            // const newId = (maxId + 1);

            await Browsers.create({
                name: req.body.browser
            });
        }

        if(type == 'language') {
            // Get max id
            // const query = await sequelize.query('SELECT id FROM languages ORDER BY id DESC LIMIT 1', {
            //     type: QueryTypes.SELECT,
            //     mapToModel: Languages
            // });
            // const maxId = query[0].id;
            // const newId = (maxId + 1);

            await Languages.create({
                name: req.body.language
            });
        }

        if(type == 'tz') {
            // Get max id
            // const query = await sequelize.query('SELECT id FROM timezones ORDER BY id DESC LIMIT 1', {
            //     type: QueryTypes.SELECT,
            //     mapToModel: Timezones
            // });
            // const maxId = query[0].id;
            // const newId = (maxId + 1);

            await Timezones.create({
                zone: req.body.tz
            });
        }

        if(type == 'banner_size') {
            // Get max id
            // const query = await sequelize.query('SELECT id FROM banner_sizes ORDER BY id DESC LIMIT 1', {
            //     type: QueryTypes.SELECT,
            //     mapToModel: Banner_Sizes
            // });
            // const maxId = query[0].id;
            // const newId = (maxId + 1);

            await Banner_Sizes.create({
                size: req.body.banner_size
            });
        }

        if(type == 'button') {
            // Get max id
            // const query = await sequelize.query('SELECT id FROM btns ORDER BY id DESC LIMIT 1', {
            //     type: QueryTypes.SELECT,
            //     mapToModel: Btns
            // });
            // const maxId = query[0].id;
            // const newId = (maxId + 1);

            await Btns.create({
                name: req.body.button
            });
        }

        if(type == 'campType') {
            // Validate fields
            const postedFields = req.body.camp_type_fields.split(',').map(field => field.trim());
            const allowedFields = ['title', 'desc', 'banner', 'btn', 'follow'];
            for(let field of postedFields) {
                if(!allowedFields.includes(field)) {
                    const err = new Error('Posted Field does not exist or not allowed!');
                    err.statusCode = 422;
                    throw err;
                }
            }

            // Get max id
            // const query = await sequelize.query('SELECT id FROM campaign_types ORDER BY id DESC LIMIT 1', {
            //     type: QueryTypes.SELECT,
            //     mapToModel: Campaign_types
            // });
            // const maxId = query[0]?.id || 0;
            // const newId = (maxId + 1);

            await Campaign_types.create({
                name: req.body.camp_type,
                desc: req.body.camp_type_desc,
                fields: postedFields.join(','),
                icon: req.body.camp_type_icon
            });
        }

        return {
            msg: 'success'
        }
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        throw err;
    }
}

exports.deleteSiteDataHelper = async (req) => {
    if (!req.userInfo || req.userInfo.rank != 1) {
        const err = new Error("Not allowed!");
        err.statusCode = 401;
        throw err;
    }

    try {
        const type = req.query.type;
        const id = req.query.id;

        if(type == 'category') {
            await Categories.findOneAndDelete({_id: id});
        }

        if(type == 'os') {
            await Os.findOneAndDelete({_id: id});
        }

        if(type == 'browser') {
            await Browsers.findOneAndDelete({_id: id});
        }

        if(type == 'language') {
            await Languages.findOneAndDelete({_id: id});
        }

        if(type == 'tz') {
            await Timezones.findOneAndDelete({_id: id});
        }

        if(type == 'banner_size') {
            await Banner_Sizes.findOneAndDelete({_id: id});
        }

        if(type == 'button') {
            await Btns.findOneAndDelete({_id: id});
        }

        if(type == 'campType') {
            await Campaign_types.findOneAndDelete({_id: id});
        }

        return {
            msg: 'success'
        }

    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        throw err;
    }
}
