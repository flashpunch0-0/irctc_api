// const { Pool } = require("pg");

// require("dotenv").config();
// const pool = new Pool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: Number(process.env.DB_PORT),
// });

// module.exports = pool;
const { Sequelize } = require("sequelize");
require("dotenv").config();

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
