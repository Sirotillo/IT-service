const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Clients = require("./clients.model");

const SupportTickets = sequelize.define(
  "supportTickets",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM(["waiting", "answered"]),
      defaultValue: "waiting",
    },
  },
  {
    timestamps: false,
    tableName: "supportTickets",
  }
);

SupportTickets.belongsTo(Clients);

Clients.hasMany(SupportTickets);

module.exports = SupportTickets;
