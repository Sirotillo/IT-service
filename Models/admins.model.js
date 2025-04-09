const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Admins = sequelize.define(
  "admins",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    is_creator: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        is: /^\+998\s\d{2}\s\d{3}\s\d{2}\s\d{2}$/, // +998 99 999 99 99
      },
    },
    token: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: /^\d{2}-\d{3}-\d{2}-\d{2}$/, // 12-345-67-89
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("superadmin", "admin"),
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    timestamps: false,
    tableName: "admins",
  }
);

module.exports = Admins;
