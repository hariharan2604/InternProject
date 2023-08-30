const express = require("express");
const router = express.Router();
const axios = require("axios");
const { response } = require("express");

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) throw err;
    else res.redirect("/");
  });
});

router.get("/admin/profile", async (req, res, next) => {
  const id = req.session.user;
  const userData = await axios.get(`http://localhost:4000/users/${id}`);
  const name = req.session.name;
  const data = userData.data;
  const image = await axios.get(
    `http://localhost:4000/users/image/${data.employeeId}`
  );
  const profileImage = image.data.filePath;
  res.render("profile", { data, name, profileImage, isAdmin: true });
});

router.get("/dashboard", async (req, res, next) => {
  const id = req.session.user;
  console.log(id);
  const isAdmin = await axios.get(`http://localhost:4000/users/${id}`);
  console.log(isAdmin.data);
  if (isAdmin.data.Credential.isAdmin) {
    if (req.query.branch) {
      const usersByBranch = await axios.get(
        `http://localhost:4000/users/filter/${req.query.branch}`
      );
      res.render("admin", {
        data: usersByBranch.data,
        name: req.session.name,
        id: req.session.user,
      });
    } else {
      const usersByBranch = await axios.get(
        `http://localhost:4000/users/filter/All`
      );
      res.render("admin", {
        data: usersByBranch.data,
        name: req.session.name,
        id: req.session.user,
      });
    }
  } else {
    const userData = await axios.get(`http://localhost:4000/users/${id}`);
    const name = req.session.name;
    const data = userData.data;
    const image = await axios.get(
      `http://localhost:4000/users/image/${data.employeeId}`
    );
    const profileImage = image.data.filePath;
    res.render("profile", { data, name, profileImage });
  }
});

router.post("/update", async (req, res, next) => {
  const updatedDetails = req.body;
  const userType = await axios.get(
    `http://localhost:4000/users/type/${req.session.user}`
  );
  const response = await axios.put(
    `http://localhost:4000/users/update/${updatedDetails.employeeId}`,
    updatedDetails
  );
  if (response.data.message) {
    res.render("error");
  } else {
    res.redirect("/dashboard");
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
  res.redirect(`/dashboard?branch=${req.body.branch}`);
});

router.get("/delete/:id", async (req, res, next) => {
  const isAdmin = await axios.get(
    `http://localhost:4000/users/type/${req.session.user}`
  );
  const flag = await axios.delete(
    `http://localhost:4000/users/delete/${req.params.id}`
  );
  if (flag.data.success) {
    if (isAdmin.data.isAdmin) {
      req.session.destroy((err) => {
        if (err) res.render(err);
        else res.redirect("/");
      });
    } else res.redirect("/dashboard");
  } else {
    res.render("error");
  }
});

module.exports = router;
