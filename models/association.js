const { DataTypes } = require("sequelize");

module.exports = (models) => {
  const { User, Credential, Image } = models;

  // Define associations
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
};
