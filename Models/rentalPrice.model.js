const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const RentalPrice = sequelize.define(
  "rentalPrice",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    monthly_price: {
      type: DataTypes.INTEGER,
    },
    yearly_price: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: false,
    tableName: "rentalPrice",
  }
);

module.exports = RentalPrice;
