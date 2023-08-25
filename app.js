const express = require("express");

require("dotenv").config();
// const connection = require("./db/connection");
const UserController = require("./controllers/userController");
const morgan = require("morgan");

const app = express();
app.use(express.urlencoded());
const PORT = process.env.PORT || 3000;
app.use(morgan("dev"));
app.use(express.json());
const userController = new UserController();

app.post("/users", userController.createUser);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
