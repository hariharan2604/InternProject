const express = require("express");
const path = require("path"); // Add this line
const sequelize = require("./db/connection");
const associations = require("./models/association");
const User = require("./models/User");
const Credential = require("./models/Credential");
const Image = require("./models/Image");
const UserController = require("./controllers/userController");
const morgan = require("morgan");
const axios = require("axios");
const app = express();
const session = require("express-session");
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(
  session({
    secret: "Web Cookie",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.json());

associations({ User, Credential, Image });
const userController = new UserController();

app.use("/users", require("./routes/crud"));
app.use("/", require("./routes/nav"));

const PORT = process.env.PORT || 3000;
sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error syncing models:", error);
  });
