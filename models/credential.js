const { DataTypes, Model } = require("sequelize");
const sequelize = require("../db/connection");

class Credential extends Model {}

Credential.init(
  {
    userName: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
    },
  },
  { sequelize, modelName: "Credential" }
);

module.exports = Credential;
