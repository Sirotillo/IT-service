const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Contracts = require("./contracts.model");

const Invoices = sequelize.define(
  "invoices",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    paid_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    amount: {
      type: DataTypes.BIGINT,
    },
    status: {
      type: DataTypes.STRING,
    },
    payment_method: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
    tableName: "invoices",
  }
);

Invoices.belongsTo(Contracts, {
  foreignKey: "contractId",
});

Contracts.hasMany(Invoices, {
  foreignKey: "contractId",
});

module.exports = Invoices;
