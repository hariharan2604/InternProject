const { DataTypes, Model } = require("sequelize");
const sequelize = require("../db/connection");
const Credential = require("./Credential");
const Image = require("./Image");
class User extends Model { }

User.init(
  {
    employeeId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    employeeName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobileNumber: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
    },
    gender: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    designation: {
      type: DataTypes.STRING,
    },
    maritalStatus: {
      type: DataTypes.STRING,
    },
    branch: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "User",
  }
);

User.hasOne(Credential, {
  onDelete: "CASCADE",
  foreignKey: {
    name: "employeeId",
    type: DataTypes.UUID,
    allowNull: false,
  },
});
User.hasOne(Image, {
  onDelete: "CASCADE",
  foreignKey: {
    name: "employeeId",
    type: DataTypes.UUID,
    allowNull: false,
  },
});
Credential.belongsTo(User, {
  onDelete: "CASCADE",
  foreignKey: {
    name: "employeeId",
    type: DataTypes.UUID,
    allowNull: false,
  },
});
Image.belongsTo(User, {
  onDelete: "CASCADE",
  foreignKey: {
    name: "employeeId",
    type: DataTypes.UUID,
    allowNull: false,
  },
});
module.exports = User;
