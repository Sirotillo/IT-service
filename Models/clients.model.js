const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Clients = sequelize.define(
  "clients",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    full_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING(20),
      validate: {
        is: /^\d{2}-\d{3}-\d{2}-\d{2}$/,
      },
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(30),
      defaultValue: "active",
    },
  },
  {
    timestamps: false,
    tableName: "clients",
  }
);

module.exports = Clients;
