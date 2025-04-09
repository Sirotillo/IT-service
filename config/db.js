// const { Sequelize } = require("sequelize");
// const config = require("config");

// module.exports = new Sequelize(
//   config.get("db_name"),
//   config.get("db_username"),
//   config.get("db_password"),
//   {
//     dialect: "postgres",
//     logging: false,
//     host: config.get("db_host"),
//     port: config.get("db_port"),
//   }
// );

const config = require("config");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  config.get("db_name"),
  config.get("db_username"),
  config.get("db_password"),
  {
    host: "localhost",
    dialect: "postgres",
    logging: false,
    host: config.get("db_host"),
    port: config.get("db_port"),
  }
);

async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true });
    console.log("Barcha jadvallar yaratildi!");
  } catch (error) {
    console.error("DB yaratishda xatolik:", error);
  }
}

syncDatabase();

module.exports = sequelize;
