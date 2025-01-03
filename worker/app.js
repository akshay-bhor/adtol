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

// Testing Cron Jobs
// router.get('/run-cron', (_, res, __) => {
//     tasks.processAdStatsJob();
//     res.status(200).json({msg:'success'});
// });

app.use(router);

app.listen(process.env.PORT || 8080, function () {
    console.log('Worker instance is online');
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

cron.schedule('0 2 * * *', () => { // Execute everyday at 2 AM
    // Update referrel stats
    tasks.updateRefStatsJob();
});

cron.schedule('0 1 * * *', () => { // Execute at 1AM
    // Delete old data
    tasks.deleteOldDataJob();
});

cron.schedule('0 0 * * *', () => { // Execute at 12 AM
    // Allocate today's budget
    tasks.allocateDailyBudgetJob();
});

cron.schedule('*/15 * * * *', () => { // Execute every 15 min
    // Process day parting
    tasks.processDayPartingJob();
});

cron.schedule('*/10 * * * *', () => { // Execute every 10 min
    // Process ad stats
    tasks.processAdStatsJob();
});