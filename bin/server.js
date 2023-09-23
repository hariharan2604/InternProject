const app = require("../app.js");
const { createServer } = require("http");
const sequelize = require("../db/connection.js");
sequelize.authenticate();
const server = createServer(app);
server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
