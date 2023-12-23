// controllers/UserController.js
const fs = require('fs')
const path=require("path")
const { Op } = require("sequelize");
const User = require("../models/User");
const Credential = require("../models/Credential");
const Image = require("../models/Image");

class UserController {
  async createUser(req, res) {
    try {
      console.log(req.body);
      const details = {
        employeeName: req.body.employeeName,
        mobileNumber: req.body.mobileNumber,
        age: req.body.age,
        gender: req.body.gender,
        email: req.body.email,
        designation: req.body.designation,
        maritalStatus: req.body.maritalStatus,
        branch: req.body.branch,
      };
      const userDetail = await User.create(details);
      await Credential.create({
        employeeId: userDetail.employeeId,
        userName: req.body.userName,
        password: req.body.password,
        isAdmin: req.body.isAdmin,
      });
      const userWithCredential = await User.findOne({
        where: {
          employeeId: userDetail.employeeId,
        },
        include: [Credential],
      });
      res.status(201).json(userWithCredential);
    } catch (error) {
      console.log(error.stack);
      res.json({ message: "Internal Server Error" });
    }
  }

  async uploadImage(req, res) {
    try {
      const filePath = path.parse(req.body.path);
      fs.writeFileSync(`${process.env.ASSET_PATH}${filePath.base}`, fs.readFileSync(filePath.dir + "/" + filePath.base))
      fs.unlinkSync(req.body.path)
      let targetFile=`${process.env.ASSET_PATH}${filePath.base}`
      const imgFlag = await Image.create({
        employeeId: req.params.id,
        fileName: filePath.base,
        filePath: targetFile,
      });
      // res.send(imgFlag);
      if (!imgFlag) {
        res.json({ message: "Error in uploading image" });
      }
      res.status(200).json({ success: "Uploaded successfully" });
    } catch (error) {
      console.log(error.stack);
      res.json({ message: "Internal Server Error" });
    }
  }

  async getImage(req, res) {
    try {
      const id = req.params.id;
      const file = await Image.findByPk(id, {
        attributes: ["fileName"],
      });
      console.log("The file", file);
      // res.send("Hello");
      if (!file) {
        res.json({ message: "No Image found" });
      } else {
        res.status(200).json(file);
      }
    } catch (error) {
      console.log(error.stack);
      res.json({ error: "Internal Server Error" });
    }
  }

  async authUser(req, res) {
    try {
      console.log(req);
      const userDetail = await Credential.findOne({
        where: {
          [Op.and]: {
            userName: req.body.userName,
            password: req.body.password,
          },
        },
        include: [User],
      });
      if (!userDetail) res.json({ message: "Incorrect Username Or Password" });
      else res.status(200).json(userDetail);
    } catch (error) {
      console.log(error);
      res.json({ message: "Internal Server Error" });
    }
  }

  async getUsers(req, res) {
    try {
      const allUsers = await User.findAll({
        include: [
          {
            model: Credential,
            where: {
              isAdmin: false,
            },
          },
        ],
      });
      if (!allUsers) res.json({ message: "No Employees" });
      res.status(200).json(allUsers);
    } catch (error) {
      res.json({ message: "Internal Server Error" });
    }
  }

  async getUserType(req, res) {
    try {
      const id = req.params.id;
      const isAdmin = await Credential.findOne({
        where: {
          employeeId: id,
        },
        attributes: ["isAdmin"],
      });
      res.status(200).json(isAdmin);
    } catch (error) {
      console.log(error.stack);
      res.json({ message: "Internal Server Error" });
    }
  }

  async getUsersByBranch(req, res) {
    try {
      let userSelect;
      if (req.params.branch === "All") {
        userSelect = await User.findAll({
          include: [
            {
              model: Credential,
              where: {
                isAdmin: false,
              },
            },
          ],
        });
      } else {
        userSelect = await User.findAll({
          where: {
            branch: req.params.branch,
          },
          include: [
            {
              model: Credential,
              where: {
                isAdmin: false,
              },
            },
          ],
        });
      }
      if (userSelect.length === 0) {
        res.json({ message: `No Employees.` });
      } else {
        res.status(200).json(userSelect);
      }
    } catch (error) {
      console.log(error.stack);
      res.json({ message: "Internal Server Error" });
    }
  }

  async getUserById(req, res) {
    try {
      const user = await User.findByPk(req.params.id, { include: Credential });
      if (!user) {
        res.json({ message: "Employee not found" });
      } else {
        res.status(200).json(user);
      }
    } catch (error) {
      console.log(error.stack);
      res.json({ message: "Internal Server Error" });
    }
  }

  async updateUser(req, res) {
    try {
      const userDetail = await User.findByPk(req.params.id);
      const updatedUser = await userDetail.update({
        employeeName: req.body.employeeName,
        mobileNumber: req.body.mobileNumber,
        age: req.body.age,
        gender: req.body.gender,
        email: req.body.email,
        designation: req.body.designation,
        maritalStatus: req.body.maritalStatus,
        branch: req.body.branch,
      });
      if (!updatedUser) res.json({ message: "Error in Updating Employee" });
      else res.status(200).json(updatedUser);
    } catch (error) {
      console.log(error.stack);
      res.json({ message: "Internal Server Error" });
    }
  }

  async deleteUserWithCredential(req, res) {
    try {
      const userIdToDelete = req.params.id; // Get the user ID to delete
      const filename = await Image.findByPk(userIdToDelete);
      const deletedUser = await User.destroy({
        where: { employeeId: userIdToDelete },
        cascade: true,
      });
      if (deletedUser) {
        const filePath = process.env.ASSET_PATH+filename.fileName;
        fs.unlinkSync(filePath);
        return res.status(200).json({
          success: "User and associated Credential deleted successfully",
        });
      } else {
        return res.json({ message: "User not found" });
      }
    } catch (error) {
      return res.json({
        message: "An error occurred during delete",
        details: error.message,
      });
    }
  }
}

module.exports = UserController;
