const express = require("express");
const path = require("path");
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
    cookie: { maxAge: 900000 },
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.json());
associations({ User, Credential, Image });
const userController = new UserController();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "/public/uploads"),
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage });

function requireAuth(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/");
  }
}

app.get("/register", (req, res, next) => {
  res.render("register");
});
app.get("/", (req, res, next) => {
  if (req.query) res.render("login", { flag: req.query.flag });
  else res.render("login");
});

app.post("/register", upload.single("image"), async (req, res, next) => {
  const formData = req.body;
  const userDetails = await axios.post(
    "http://localhost:4000/users/register",
    formData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  if (userDetails.data.message) {
    res.render("register", userDetails.data);
  } else {
    const { filename, path: filepath } = req.file;
    const imageUpload = await axios.post(
      `http://localhost:4000/users/upload/image/${userDetails.data.employeeId}`,
      {
        filename: filename,
        path: `/uploads/${filename}`,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    if (imageUpload.data.message) {
      res.render("register", imageUpload.data);
    } else {
      res.redirect("/?flag=Please Login to Continue");
    }
  }
});
app.post("/login", async (req, res, next) => {
  const formData = req.body;
  const isAuthenticated = await axios.post(
    "http://localhost:4000/users/login",
    formData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  if (isAuthenticated.data.message) {
    res.redirect(`/?flag=${isAuthenticated.data.message}`);
  } else {
    req.session.user = isAuthenticated.data.employeeId;
    req.session.name = isAuthenticated.data.User.employeeName;
    res.redirect("/dashboard");
  }
});
app.use("/users", require("./routes/crud"));
app.use("/", requireAuth, require("./routes/nav"));
const PORT = process.env.PORT || 3000;
sequelize
  .sync({ alter: true })
  .then(() => {})
  .catch((error) => {
    console.error("Error syncing models:", error);
  });

module.exports = app;
