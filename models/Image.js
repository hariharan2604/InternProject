const { DataTypes, Model } = require("sequelize");
const sequelize = require("../db/connection"); // Configure Sequelize instance

class Image extends Model {}

Image.init(
  {
    employeeId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Image",
  }
);

module.exports = Image;
