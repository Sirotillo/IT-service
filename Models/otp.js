const { DataTypes } = require("sequelize");
const {sequelize} = require("../config/db");

const Otp = sequelize.define("Otp", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Otp;
