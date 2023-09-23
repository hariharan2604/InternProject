require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: process.env.DB,
  host: process.env.DB_HOST,
  // port:process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  retry: {
    max: 5, // Maximum number of retries
    match: ['ECONNREFUSED', 'ETIMEDOUT'], // Error codes to trigger a retry
  },
});

module.exports = sequelize;
