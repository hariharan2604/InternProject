const { DataTypes, Model } = require("sequelize");
const sequelize = require("../db/connection"); // Configure Sequelize instance

class Image extends Model {}

Image.init(
  {
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mimetype: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    data: {
      type: DataTypes.BLOB("long"), // Use BLOB type for binary data
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Image",
  }
);

module.exports = Image;
