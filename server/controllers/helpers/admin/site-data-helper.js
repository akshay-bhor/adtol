const Browsers = require("../../../models/browsers");
const Categories = require("../../../models/category");
const Os = require("../../../models/os");
const Timezones = require("../../../models/timezones");

exports.getSiteDataHelper = async (req) => {
    if (!req.userInfo || req.userInfo.rank != 1) {
        const err = new Error("Not allowed!");
        err.statusCode = 401;
        throw err;
    }

    try { 
        // Get cats
        const catsData = await Categories.findAll();
        const cats = catsData.map(data => {
            return {
                id: data.dataValues.id,
                name: data.dataValues.name
            }
        });

        // Get OS
        const osData = await Os.findAll();
        const os = osData.map(data => {
            return {
                id: data.dataValues.id,
                name: data.dataValues.name,
                version: data.dataValues.version
            }
        });

        // Get Browsers
        const browserData = await Browsers.findAll();
        const browsers = browserData.map(data => {
            return {
                id: data.dataValues.id,
                name: data.dataValues.name
            }
        });

        // Get Languages
        const langData = await Browsers.findAll();
        const languages = langData.map(data => {
            return {
                id: data.dataValues.id,
                name: data.dataValues.name
            }
        });

        // Get Timezones
        const tzData = await Timezones.findAll();
        const timezones = tzData.map(data => {
            return {
                id: data.dataValues.id,
                zone: data.dataValues.zone
            }
        });

        return {
            cats,
            os,
            browsers,
            languages,
            timezones
        }

    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        throw err;
    }
}