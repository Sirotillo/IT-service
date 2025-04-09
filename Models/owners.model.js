const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Owners = sequelize.define(
  "owners",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    company_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        is: /^\+998\s\d{2}\s\d{3}\s\d{2}\s\d{2}$/, // +998 99 999 99 99
      },
    },
    token: {
      type: DataTypes.STRING(50),
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    website: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    addres: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "owners", 
  }
);

module.exports = Owners;  
