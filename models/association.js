const User = require("./user");
const Credential = require("./credential");
const sequelize = require("../db/connection");

async function connect() {
  // User.hasOne(Credential, { foreignKey: "employeeId" });
  User.hasOne(Credential, { foreignKey: "employeeId" });
  Credential.belongsTo(User, { foreignKey: "employeeId" });
  await sequelize.sync({ alter: true });
}

module.exports = connect();
