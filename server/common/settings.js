const Browsers = require("../models/browsers");
const Categories = require("../models/category");
const Countries = require("../models/countries");
const Devices = require("../models/devices");
const Languages = require("../models/languages");
const Os = require("../models/os");
const Settings = require("../models/settings");

const App_Settings = {};

exports.loadSettings = async () => {
  try {
    /**
     * Load settings because in ads table we are storing no id values instead of text
     * matching numbers are inexpensive so to match targets like country os browser which we will get in text from
     * user request we will map that to id: number which we will match against numbers stored in ads table
     */

    let tmp = [];
    // Browsers
    // let browsers = await Browsers.findAll({
    //   order: [["id", "ASC"]],
    //   attributes: ["id", "name"],
    // });
    let browsers = await Browsers.find({});
    browsers.forEach((data) => {
      const id = data._id.toString()
      tmp[id] = data.name;
    });
    App_Settings.browsers = { ...tmp };
    tmp = [];

    // Country
    // let countries = await Countries.findAll({
    //   order: [["id", "ASC"]],
    //   attributes: ["id", "code", "name", "dial_code"],
    // });
    let countries = await Countries.find({});
    countries.forEach((data) => {
      const id = data._id.toString();
      tmp[id] = [
        data.code,
        data.name,
        data.dial_code,
      ];
    });
    App_Settings.countries = { ...tmp };
    tmp = [];

    // Devices
    // let devices = await Devices.findAll({
    //   order: [["id", "ASC"]],
    //   attributes: ["id", "name"],
    // });
    let devices = await Devices.find({});
    devices.forEach((data) => {
      const id = data._id.toString()
      tmp[id] = data.name;
    });
    App_Settings.devices = { ...tmp };
    tmp = [];

    // Languages
    // let languages = await Languages.findAll({
    //   order: [["id", "ASC"]],
    //   attributes: ["id", "name"],
    // });
    let languages = await Languages.find({});
    languages.forEach((data) => {
      const id = data._id.toString()
      tmp[id] = data.name;
    });
    App_Settings.languages = { ...tmp };
    tmp = [];

    // Categories
    // let categories = await Categories.findAll({
    //   order: [["id", "ASC"]],
    //   attributes: ["id", "name"],
    // });
    let categories = await Categories.find({});
    categories.forEach((data) => {
      const id = data._id.toString()
      tmp[id] = data.name;
    });
    App_Settings.categories = { ...tmp };
    tmp = [];

    // Os
    // let os = await Os.findAll({
    //   order: [["id", "ASC"]],
    //   attributes: ["id", "name", "version"],
    // });
    let os = await Os.find({});
    os.forEach((data) => {
      const id = data._id.toString()
      tmp[id] = [data.name, data.version];
    });
    App_Settings.os = { ...tmp };
    tmp = [];

    // Web settings
    // let web_settings = await Settings.findAll();
    // web_settings.forEach((data) => {
    //   tmp = { ...data };
    // });
    // App_Settings.web_settings = { ...tmp };
  } catch (err) {
    console.log(err);
    console.log("Failed to load common web settings");
  }
};

exports.App_Settings = App_Settings;
