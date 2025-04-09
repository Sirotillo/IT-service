const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Clients = require("./clients.model");
const Products = require("./products.model");

const Contracts = sequelize.define(
  "contracts",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    payment_amount: {
      type: DataTypes.STRING,
    },
    notes: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
    tableName: "cotracts",
  }
);

Contracts.belongsTo(Clients);
Contracts.belongsTo(Products);

Clients.hasMany(Contracts);
Products.hasMany(Contracts);

module.exports = Contracts;
