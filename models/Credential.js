const { DataTypes, Model } = require("sequelize");
const sequelize = require("../db/connection");

class Credential extends Model {}

Credential.init(
  {
    employeeId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    userName: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Credential",
  }
);

module.exports = Credential;
