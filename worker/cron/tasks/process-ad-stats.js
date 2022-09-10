const { QueryTypes } = require("sequelize");
const sequelize = require("../../utils/db");
const { cronLogWrite } = require("../cron-logger");

exports.processAdStats = async () => {
  try {
    cronLogWrite("Started Processing Ad Stats");

    const date = new Date().toISOString().slice(0, 10);
    const time_unix = Math.floor(new Date().getTime() / 1000);
    const today_unix = Math.floor(new Date(date).getTime() / 1000);
    const processed = 0;

    // Get stats by advertisers
    const viewsByAdvertiser = await sequelize.query(
      `SELECT COUNT(id) as views, ad_uid FROM views WHERE processed = ? AND time_unix <= ? GROUP BY ad_uid`,
      {
        type: QueryTypes.SELECT,
        replacements: [processed, time_unix],
      }
    );
    
    // Get stats by campaigns
    const viewsByCampaigns = await sequelize.query(
      `SELECT COUNT(id) as views, campaign_id  FROM views WHERE processed = ? AND time_unix <= ? GROUP BY campaign_id`,
      {
        type: QueryTypes.SELECT,
        replacements: [processed, time_unix],
      }
    );
    
    // Get stats by publishers
    const viewsByPublisher = await sequelize.query(
      `SELECT COUNT(id) as views, pub_uid  FROM views WHERE processed = ? AND time_unix <= ? GROUP BY pub_uid`,
      {
        type: QueryTypes.SELECT,
        replacements: [processed, time_unix],
      }
    );
    
    // Get stats by sites
    const viewsBySites = await sequelize.query(
      `SELECT COUNT(id) as views, site_id  FROM views WHERE processed = ? AND time_unix <= ? GROUP BY site_id`,
      {
        type: QueryTypes.SELECT,
        replacements: [processed, time_unix],
      }
    );
    
    // Get stats by (device, ad_uid, campaign)
    const adViewsByDevice = await sequelize.query(
      `SELECT COUNT(id) as views, campaign_id, ad_uid, device FROM views WHERE processed = ? AND time_unix <= ? GROUP BY campaign_id, ad_uid, device`,
      {
        type: QueryTypes.SELECT,
        replacements: [processed, time_unix],
      }
    );
    const pubViewsByDevice = await sequelize.query(
      `SELECT COUNT(id) as views, site_id, pub_uid, device FROM views WHERE processed = ? AND time_unix <= ? GROUP BY site_id, pub_uid, device`,
      {
        type: QueryTypes.SELECT,
        replacements: [processed, time_unix],
      }
    );

    // Get stats by country
    const adViewsByCountry = await sequelize.query(
      `SELECT COUNT(id) as views, campaign_id, ad_uid, country FROM views WHERE processed = ? AND time_unix <= ? GROUP BY campaign_id, ad_uid, country`,
      {
        type: QueryTypes.SELECT,
        replacements: [processed, time_unix],
      }
    );
    const pubViewsByCountry = await sequelize.query(
      `SELECT COUNT(id) as views, site_id, pub_uid, country FROM views WHERE processed = ? AND time_unix <= ? GROUP BY site_id, pub_uid, country`,
      {
        type: QueryTypes.SELECT,
        replacements: [processed, time_unix],
      }
    );

    // Get stats by browser
    const adViewsByBrowser = await sequelize.query(
      `SELECT COUNT(id) as views, campaign_id, ad_uid, browser FROM views WHERE processed = ? AND time_unix <= ? GROUP BY campaign_id, ad_uid, browser`,
      {
        type: QueryTypes.SELECT,
        replacements: [processed, time_unix],
      }
    );
    const pubViewsByBrowser = await sequelize.query(
      `SELECT COUNT(id) as views, site_id, pub_uid, browser FROM views WHERE processed = ? AND time_unix <= ? GROUP BY site_id, pub_uid, browser`,
      {
        type: QueryTypes.SELECT,
        replacements: [processed, time_unix],
      }
    );

    // Get stats by os
    const adViewsByOs = await sequelize.query(
      `SELECT COUNT(id) as views, campaign_id, ad_uid, os FROM views WHERE processed = ? AND time_unix <= ? GROUP BY campaign_id, ad_uid, os`,
      {
        type: QueryTypes.SELECT,
        replacements: [processed, time_unix],
      }
    );
    const pubViewsByOs = await sequelize.query(
      `SELECT COUNT(id) as views, site_id, pub_uid, os FROM views WHERE processed = ? AND time_unix <= ? GROUP BY site_id, pub_uid, os`,
      {
        type: QueryTypes.SELECT,
        replacements: [processed, time_unix],
      }
    );

    // Process all stats in one transaction
    ts = await sequelize.transaction();
    try {
      /**
       * Process View Count
       */

      const increaseViewCountPromises = [];
      viewsByAdvertiser.forEach((item) => {
        increaseViewCountPromises.push(
          increaseViewCount("viewsByAdvertiser", ts, item.ad_uid, item.views)
        );
      });
      viewsByCampaigns.forEach((item) => {
        increaseViewCountPromises.push(
          increaseViewCount(
            "viewsByCampaigns",
            ts,
            item.campaign_id,
            item.views
          )
        );
      });
      viewsByPublisher.forEach((item) => {
        increaseViewCountPromises.push(
          increaseViewCount("viewsByPublisher", ts, item.pub_uid, item.views)
        );
      });
      viewsBySites.forEach((item) => {
        increaseViewCountPromises.push(
          increaseViewCount("viewsBySites", ts, item.site_id, item.views)
        );
      });

      await Promise.all(increaseViewCountPromises);
      /**
       * End Process View Count
       */

      // Increase View Count for Devices
      const increaseViewsByDevicePromises = [];
      adViewsByDevice.forEach((item) => {
        increaseViewsByDevicePromises.push(
          executeUpdateOrInsertQuery(
            "summary_device",
            today_unix,
            "device",
            item.device,
            item.campaign_id,
            null,
            item.ad_uid,
            null,
            item.views,
            ts
          )
        );
      });
      pubViewsByDevice.forEach((item) => {
        increaseViewsByDevicePromises.push(
          executeUpdateOrInsertQuery(
            "summary_device",
            today_unix,
            "device",
            item.device,
            null,
            item.site_id,
            null,
            item.pub_uid,
            item.views,
            ts
          )
        );
      });
      await Promise.all(increaseViewsByDevicePromises);

      // Increase View Count for Countries
      const increaseViewsByCountryPromises = [];
      adViewsByCountry.forEach((item) => {
        increaseViewsByCountryPromises.push(
          executeUpdateOrInsertQuery(
            "summary_country",
            today_unix,
            "country",
            item.country,
            item.campaign_id,
            null,
            item.ad_uid,
            null,
            item.views,
            ts
          )
        );
      });
      pubViewsByCountry.forEach((item) => {
        increaseViewsByCountryPromises.push(
          executeUpdateOrInsertQuery(
            "summary_country",
            today_unix,
            "country",
            item.country,
            null,
            item.site_id,
            null,
            item.pub_uid,
            item.views,
            ts
          )
        );
      });
      await Promise.all(increaseViewsByCountryPromises);

      // Increase View Count for Browsers
      const increaseViewsByBrowserPromises = [];
      adViewsByBrowser.forEach((item) => {
        increaseViewsByBrowserPromises.push(
          executeUpdateOrInsertQuery(
            "summary_browser",
            today_unix,
            "browser",
            item.browser,
            item.campaign_id,
            null,
            item.ad_uid,
            null,
            item.views,
            ts
          )
        );
      });
      pubViewsByBrowser.forEach((item) => {
        increaseViewsByBrowserPromises.push(
          executeUpdateOrInsertQuery(
            "summary_browser",
            today_unix,
            "browser",
            item.browser,
            null,
            item.site_id,
            null,
            item.pub_uid,
            item.views,
            ts
          )
        );
      });
      await Promise.all(increaseViewsByCountryPromises);

      // Increase View Count for Os
      const increaseViewsByOsPromises = [];
      adViewsByOs.forEach((item) => {
        increaseViewsByOsPromises.push(
          executeUpdateOrInsertQuery(
            "summary_os",
            today_unix,
            "os",
            item.os,
            item.campaign_id,
            null,
            item.ad_uid,
            null,
            item.views,
            ts
          )
        );
      });
      pubViewsByOs.forEach((item) => {
        increaseViewsByOsPromises.push(
          executeUpdateOrInsertQuery(
            "summary_os",
            today_unix,
            "os",
            item.os,
            null,
            item.site_id,
            null,
            item.pub_uid,
            item.views,
            ts
          )
        );
      });
      await Promise.all(increaseViewsByCountryPromises);

      /**
       * FINAL STEP:
       *      SET PROCESSED FLAG
       */
      await sequelize.query(
        `UPDATE views SET processed = 1 WHERE processed = 0 AND time_unix <= ?`,
        {
          type: QueryTypes.UPDATE,
          replacements: [time_unix],
          transaction: ts,
        }
      );

      await ts.commit();
    } catch (err) {
      await ts.rollback();
      throw err;
    }

    cronLogWrite("Processed Ad Stats");
  } catch (err) {
    const msg = `Error occured processing ad stats [${err}]`;
    cronLogWrite(msg);
  }
};

const increaseViewCount = (type, ts, id, count) => {
  if (type == "viewsByAdvertiser")
    return sequelize.query(
      "UPDATE users u SET u.ad_views = u.ad_views + ? WHERE u.id = ?",
      {
        type: QueryTypes.UPDATE,
        replacements: [count, id],
        transaction: ts,
      }
    );

  if (type == "viewsByCampaigns")
    return sequelize.query(
      "UPDATE campaigns c SET c.views = c.views + ? WHERE c.id = ?",
      {
        type: QueryTypes.UPDATE,
        replacements: [count, id],
        transaction: ts,
      }
    );

  if (type == "viewsByPublisher")
    return sequelize.query(
      "UPDATE users u SET u.pub_views = u.pub_views + ? WHERE u.id = ?",
      {
        type: QueryTypes.UPDATE,
        replacements: [count, id],
        transaction: ts,
      }
    );

  if (type == "viewsBySites")
    return sequelize.query(
      "UPDATE pub_sites ps SET ps.views = ps.views + ? WHERE ps.id = ?",
      {
        type: QueryTypes.UPDATE,
        replacements: [count, id],
        transaction: ts,
      }
    );
};

/**
 * @returns {Promise}
 * @resolve {True}
 * Used in Ad serving and process
 */
const executeUpdateOrInsertQuery = async (
  table,
  day_unix,
  col,
  value,
  campaign,
  website,
  ad_uid,
  pub_uid,
  incCount,
  ts
) => {
  let update;
  if (campaign) {
    update = await sequelize.query(
      `UPDATE ${table} SET views = views + ${incCount} WHERE day_unix = ? AND ${col} = ? AND campaign = ? AND ad_uid = ?`,
      {
        type: QueryTypes.UPDATE,
        replacements: [day_unix, value, campaign, ad_uid],
        transaction: ts,
      }
    );
  }
  if (website) {
    update = await sequelize.query(
      `UPDATE ${table} SET views = views + ${incCount} WHERE day_unix = ? AND ${col} = ? AND website = ? AND pub_uid = ?`,
      {
        type: QueryTypes.UPDATE,
        replacements: [day_unix, value, website, pub_uid],
        transaction: ts,
      }
    );
  }

  if (update[1] < 1) {
    await executeInsertQuery(
      table,
      day_unix,
      col,
      value,
      campaign,
      website,
      ad_uid,
      pub_uid,
      incCount,
      ts
    );
  }

  return true;
};

/**
 * @returns {Promise}
 * Used in Ad serving and process
 * Inserts data in summary tables
 */
const executeInsertQuery = async (
  table,
  day_unix,
  col,
  value,
  campaign,
  website,
  ad_uid,
  pub_uid,
  viewCount,
  ts
) => {
  if (campaign) {
    return sequelize.query(
      `INSERT INTO ${table} (ad_uid, ${col}, campaign, views, day_unix) VALUES(?, ?, ?, ?, ?)`,
      {
        type: QueryTypes.INSERT,
        replacements: [ad_uid, value, campaign, viewCount, day_unix],
        transaction: ts,
      }
    );
  }

  if (website) {
    return sequelize.query(
      `INSERT INTO ${table} (pub_uid, ${col}, website, views, day_unix) VALUES(?, ?, ?, ?, ?)`,
      {
        type: QueryTypes.INSERT,
        replacements: [pub_uid, value, website, viewCount, day_unix],
        transaction: ts,
      }
    );
  }
  return;
};
