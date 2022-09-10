const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, null, null, {
    dialect: 'mysql',
    port: process.env.DB_PORT,
    logging: false,
    replication: {
        read: [{
            host: process.env.DB_HOST_READER,
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
        }],
        write: {
            host: process.env.DB_HOST,
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
        }
    },
    pool: {
        max: 200,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        timestamps: false,
        freezeTableName: true
    }
});

module.exports = sequelize;