const express = require("express");
const router = express.Router();
const axios = require("axios");
const { response } = require("express");
router.get(["/login", "/"], (req, res, next) => {
  res.render("login");
});
router.get(["/register"], (req, res, next) => {
  res.render("register");
});

router.post("/login", async (req, res, next) => {
  const formData = req.body;
  const response = await axios.post(
    "http://localhost:4000/users/login",
    formData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  if (response.data.message) {
    res.render("login", { flag: response.data.message });
  } else {
    req.session.employeeId = response.data.employeeId;
    req.session.name = response.data.User.employeeName;
    console.log(`Session:${req.session.employeeId}`);
    if (response.data.isAdmin) {
      const userDetails = await axios.get("http://localhost:4000/users/");
      res.render("admin", { data: userDetails.data, name: req.session.name });
    } else {
      const userData = await axios.get(
        `http://localhost:4000/users/${response.data.employeeId}`
      );
      const name = req.session.name;
      const data = userData.data;
      res.render("profile", { data, name });
    }
  }
});

router.post("/update", async (req, res, next) => {
  const updatedDetails = req.body;
  console.log("session" + req.session.employeeId);
  const userType = await axios.get(
    `http://localhost:4000/users/type/${req.session.employeeId}`
  );
  console.log(`Session id:${req.session.employeeId}`);
  const response = await axios.put(
    `http://localhost:4000/users/update/${updatedDetails.employeeId}`,
    updatedDetails
  );
  // console.log(response);
  if (response.data.message) {
    res.render("error");
  } else {
    console.log(userType.data);
    if (userType.data.isAdmin) {
      const userDetails = await axios.get("http://localhost:4000/users/");
      res.render("admin", { data: userDetails.data, name: req.session.name });
    } else {
      const userData = await axios.get(
        `http://localhost:4000/users/${response.data.employeeId}`
      );
      const data = userData.data;
      const name = userData.data.employeeName;
      res.render("profile", { data, name });
    }
  }
});

router.get("/update/:id", async (req, res, next) => {
  const presentDetail = await axios.get(
    `http://localhost:4000/users/${req.params.id}`
  );
  if (presentDetail.data.message) {
    res.render("error");
  } else {
    res.render("update", presentDetail.data);
  }
});

router.post("/filter", async (req, res, next) => {
  const userByBranch = await axios.get(
    `http://localhost:4000/users/filter/${req.body.branch}`
  );
  if (userByBranch)
    res.render("admin", { data: userByBranch.data, name: req.session.data });
  else res.render("error");
});
router.post("/register", async (req, res, next) => {
  const userDetails = await axios.post(
    "http://localhost:4000/users/register",
    req.body,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  if (userDetails.data.message) {
    res.render("register", userDetails.data);
  } else {
    res.render("login", { flag: "Please Login to Continue" });
  }
});

router.get("/delete/:id", async (req, res, next) => {
  const flag = await axios.delete(
    `http://localhost:4000/users/delete/${req.params.id}`
  );
  if (flag.data.success) {
    const userDetails = await axios.get("http://localhost:4000/users/");
    res.render("admin", { data: userDetails.data, name: req.session.name });
  } else {
    const userData = await axios.get("http://localhost:4000/users/");
    res.render("error");
  }
});

module.exports = router;
