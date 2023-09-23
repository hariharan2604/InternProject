'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      employeeId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      employeeName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      mobileNumber: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      age: {
        type: Sequelize.INTEGER,
      },
      gender: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      designation: {
        type: Sequelize.STRING,
      },
      maritalStatus: {
        type: Sequelize.STRING,
      },
      branch: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  },
};
