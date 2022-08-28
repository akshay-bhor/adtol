require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const sequelize = require('./utils/db');
const { loadSettings } = require('./common/settings');
const app = express();
const cluster = require('cluster');
const helmet = require('helmet');
const mongoose = require('mongoose');
// const { verifyEmailTransport } = require('./common/emailTransporter');
const { sendAlertMail } = require('./common/sendMails');
let retryCount = 0;

if(cluster.isMaster) {
    console.log(`Master Process: ${process.pid} is running`);

    // Fork workers equals no of CPUs'
    const vCPUs = process.env.NODE_ENV === 'production' ? require('os').cpus().length:2;
    for(let i = 1; i <= vCPUs; i++) {
        cluster.fork();
        console.log(`Forked worker ${i}`);
    }

    // Check if any worker comes online
    cluster.on('online', (worker) => {
        console.log(`Worker ${worker.process.pid} is online`);
    });

    // Check if worker died and fork a new one
    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
        if(retryCount < process.env.MAX_SPAWN_RETRY) {
            cluster.fork();
            console.log('Forking new worker, retry count - ' + retryCount);
            retryCount++;
        }
        else {
            if(process.env.ORIGIN != 'http://localhost:5000') {
                sendAlertMail(`${process.env.ORIGIN} API Server Down`, `Worker Instance Spawning has exceeded maximum threshold.<br />
                <b>Retry Count - ${retryCount}.</b><br />
                API server maybe down. Please investigate!`);
            }
        }
    });
}
else {
    // Static
    app.use(express.static(__dirname + '/public'));

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
    mongoose.connect(process.env.MONGO_URI).then(() => {
        app.listen(process.env.PORT || 3000, function() {
            loadSettings();
            // verifyEmailTransport();
        });
    }).catch((err) => {
        console.log(err);
    })
}