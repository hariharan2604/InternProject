// controllers/UserController.js
const User = require("../models/user");
const Credential = require("../models/credential");
require("../models/association");
const { Op } = require("sequelize");
const sequelize = require("../db/connection");
const { all } = require("express/lib/application");

class UserController {
  async createUser(req, res) {
    try {
      const userDetail = await User.create({
        employeeName: req.body.employeeName,
        mobileNumber: req.body.mobileNumber,
        age: req.body.age,
        gender: req.body.gender,
        email: req.body.email,
        designation: req.body.designation,
        maritalStatus: req.body.maritalStatus,
        branch: req.body.branch,
      });

      await Credential.create({
        userName: req.body.userName,
        password: req.body.password,
        isAdmin: req.body.isAdmin,
        employeeId: userDetail.employeeId,
      });

      res.status(201).json(
        await User.findOne({
          where: {
            [Op.eq]: {
              employeeId: userDetail.employeeId,
            },
          },
          include: [{ model: Credential }],
        })
      );
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async authUser(req, res) {
    try {
      const userDetail = await Credential.findOne({
        where: {
          [Op.and]: {
            userName: req.body.userName,
            password: req.body.password,
          },
        },
        include: [{ model: Credential, attributes: ["isAdmin"] }],
      });
      if (!userDetail)
        res.send(404).json({ message: "Incorrect Username Or Password" });
      res.send(200).json(userDetail);
    } catch (error) {
      console.log(error.stack);
      res.send(500).json({ message: "Internal Server Error" });
    }
  }

  async getUsers(req, res) {
    try {
      const allUsers = await User.findAll();
      if (!allUsers) res.send(404).json({ message: "No Employees" });
      res.send(200).json(allUsers);
    } catch (error) {
      res.send(500).json({ message: "Internal Server Error" });
    }
  }

  async getUsersByBranch(req, res) {
    try {
      const usersByBranch = await User.findAll({
        where: {
          [Op.eq]: {
            branch: req.params.branch,
          },
        },
      });
      if (!usersByBranch) {
        res.send(404).json({ message: "No Employee" });
      }
      res.send(200).json(usersByBranch);
    } catch (error) {
      console.log(error.stack);
      res.send(500).json({ message: "Internal Server Error" });
    }
  }

  async getUserById(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        res.status(404).json({ message: "Employee not found" });
      } else {
        res.status(200).json(user);
      }
    } catch (error) {
      console.log(error.stack);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async updateUser(req, res) {
    try {
      const userDetail = await User.findOne(req.params.id);
      const [affectCount, updatedRows] = await userDetail.update({
        employeeName: req.body.employeeName,
        mobileNumber: req.body.mobileNumber,
        age: req.body.age,
        gender: req.body.gender,
        email: req.body.email,
        designation: req.body.designation,
        maritalStatus: req.body.maritalStatus,
        branch: req.body.branch,
      });
      if (!affectCount)
        res.send(500).json({ message: "Error in Updating Employee" });
      res.send(200).json({ message: updatedRows });
    } catch (error) {
      console.log(error.stack);
      res.send(500).json({ message: "Internal Server Error" });
    }
  }

  async deleteUserWithCredential(req, res) {
    const { employeeId } = req.params;

    const transaction = await sequelize.transaction();

    try {
      const user = await User.findByPk(employeeId, {
        include: Credential,
      });

      if (!user) {
        res.status(404).json({ message: "Employee not found" });
      }

      if (user.Credential) {
        await user.Credential.destroy({ transaction });
      }

      await user.destroy({ transaction });

      await transaction.commit();
      res
        .status(200)
        .json({ message: "Employee and associated credential deleted" });
    } catch (error) {
      console.error("Error deleting Employee:", error);
      await transaction.rollback();
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = UserController;
