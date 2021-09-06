require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const sequelize = require('./utils/db');
const { loadSettings } = require('./common/settings');
const cron = require('node-cron');
const tasks = require('./cron/cron-jobs');
const app = express();
const cluster = require('cluster');
const helmet = require('helmet');
const { verifyEmailTransport } = require('./common/emailTransporter');
let retryCount = 0;

if(cluster.isMaster) {
    console.log(`Master Process: ${process.pid} is running`);

    // Fork workers equals no of CPUs'
    // for(let i = 1; i <= require('os').cpus().length; i++) {
    //     cluster.fork();
    //     console.log(`Forked worker ${i}`);
    // }
    cluster.fork();

    // Check if any worker comes online
    cluster.on('online', (worker) => {
        console.log(`Worker ${worker.process.pid} is online`);
    });

    // Check if worker died and fork a new one
    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
        if(retryCount < 5) {
            cluster.fork();
            console.log('Forking new worker, retry count - ' + retryCount);
            retryCount++;
        }
    });
}
else {

    // View Engine
    app.set('view engine', 'ejs');
    app.set('views', 'views');

    const apiRoutes = require('./routes/api');
    const adminRoutes = require('./routes/admin');

    app.use(cookieParser());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(helmet({contentSecurityPolicy: false}));

    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader(
            'Access-Control-Allow-Methods',
            'GET, POST, DELETE, OPTIONS'
        );
        res.setHeader('Access-Control-Allow_headers', 'Content-Type, Authorization');
        next();
    });

    app.use('/api', apiRoutes);
    app.use('/admin', adminRoutes);

    app.use((error, req, res, next) => {
        console.log(error);
        const status = error.statusCode || 500;
        const msg = error.message || 'Unknown Error Occurred!';
        const data = error.data;
        // For razorpay
        const err = error.error;

        res.status(status).json({
            msg: msg,
            data: data,
            err: err
        });
    })
    // sequelize.sync();
    app.listen(process.env.PORT || 3000, function() {
        loadSettings();
        verifyEmailTransport();
    });
}


if(cluster.isMaster) { console.log('Cron is running in master');
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

    // cron.schedule('* 2 * * *', () => { // Execute everyday at 2 AM
    //     // Update referrel stats
    //     tasks.updateRefStatsJob();
    // });

    // cron.schedule('* 1 * * *', () => { // Execute at 1AM
    //     // Delete old data
    //     tasks.deleteOldDataJob();
    // });

    // cron.schedule('* 0 * * *', () => { // Execute at 12 AM
    //     // Allocate today's budget
    //     tasks.allocateDailyBudgetJob();
    // });

    // cron.schedule('*/15 * * * *', () => { // Execute every 15 min
    //     // Process day parting
    //     tasks.processDayPartingJob();
    // });
}