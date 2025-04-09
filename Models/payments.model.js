const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Contracts = require("./contracts.model");

const Payments = sequelize.define(
  "payments",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    payment_method: {
      type: DataTypes.ENUM(["humo", "uzcard", "cash"]),
    },
    amount: {
      type: DataTypes.BIGINT,
    },
    paid_at: {
      type: DataTypes.DATE,
    },
    description: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
    tableName: "Payments",
  }
);

Payments.belongsTo(Contracts);

Contracts.hasMany(Payments);

module.exports = Payments;
