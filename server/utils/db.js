const { Sequelize } = require("sequelize");
let sequelize;

try {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
      dialect: "mysql",
      port: process.env.DB_PORT,
    }
  );
} catch (err) {
    console.log(err);
    console.log('connection to database failed on host - ' + process.env.DB_HOST + 'using username' + process.env.DB_USER);
}

module.exports = sequelize;
