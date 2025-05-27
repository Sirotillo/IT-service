const config = require("config");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  config.get("db_name"),
  config.get("db_username"),
  config.get("db_password"),
  {
    host: config.get("db_host"),
    dialect: "postgres",
    logging: false,
    port: config.get("db_port"),
  }
);

module.exports = sequelize;
