const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Categories = sequelize.define(
  "categories",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    icon: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
    tableName: "categories",
  }
);

module.exports = Categories;
