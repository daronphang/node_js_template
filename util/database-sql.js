const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  process.env.SEQUELIZE_SERVER,
  process.env.SEQUELIZE_USERNAME,
  process.env.SEQUELIZE_PASSWORD,
  {
    host: process.env.SEQUELIZE_HOST,
    dialect: process.env.SEQUELIZE_DIALECT,
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  },
);

module.exports = sequelize;
