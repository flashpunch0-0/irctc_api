const { Sequelize } = require("sequelize");
require("dotenv").config();
//  using sequqlize orm to create a conection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  "Postgres@71",
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
  }
);
module.exports = sequelize;
