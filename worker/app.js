require('dotenv').config();
const express = require('express');
const cron = require('node-cron');
const tasks = require('./cron/cron-jobs');
const app = express();
const router = express.Router();

// Health check
router.get('/', (_, res, __) => {
    res.status(200).json({msg:'success'});
});

app.listen(process.env.PORT || 8080, function () {
    console.log('Worker server is online');
});

/**
 * Cron Jobs => Run only in master
 * 
 * # ┌────────────── second (optional)
 # │ ┌──────────── minute
# │ │ ┌────────── hour
# │ │ │ ┌──────── day of month
# │ │ │ │ ┌────── month
# │ │ │ │ │ ┌──── day of week
# │ │ │ │ │ │
# │ │ │ │ │ │
# * * * * * *
*/

cron.schedule('* 2 * * *', () => { // Execute everyday at 2 AM
    // Update referrel stats
    tasks.updateRefStatsJob();
});

cron.schedule('* 1 * * *', () => { // Execute at 1AM
    // Delete old data
    tasks.deleteOldDataJob();
});

cron.schedule('* 0 * * *', () => { // Execute at 12 AM
    // Allocate today's budget
    tasks.allocateDailyBudgetJob();
});

cron.schedule('*/15 * * * *', () => { // Execute every 15 min
    // Process day parting
    tasks.processDayPartingJob();
});