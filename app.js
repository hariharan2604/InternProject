const express = require("express");
const path = require("path");
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
    `${process.env.DOMAIN_NAME}/users/register`,
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
      `${process.env.DOMAIN_NAME}/users/upload/image/${userDetails.data.employeeId}`,
      {
        filename: filename,
        path: filepath,
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
    `${process.env.DOMAIN_NAME}/users/login`,
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
module.exports = app;
