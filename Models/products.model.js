const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Categories = require("./categories.model");
const Owners = require("./owners.model");
const RentalPrice = require("./rentalPrice.model");

const Products = sequelize.define(
  "products",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
    },
    description: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.BIGINT,
    },
    status: {
      type: DataTypes.BOOLEAN,
    },
    stock_quantity: {
      type: DataTypes.BIGINT,
    },
    image_url: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
    tableName: "products",
  }
);

Products.belongsTo(Categories);
Products.belongsTo(Owners);
RentalPrice.belongsTo(Products);

Categories.hasMany(Products);
Owners.hasMany(Products);
Products.hasMany(RentalPrice);

module.exports = Products;
