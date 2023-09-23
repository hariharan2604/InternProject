'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Images', {
      employeeId: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },
      fileName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      filePath: {
        type: Sequelize.STRING,
        allowNull: false,
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

    // Add a foreign key constraint for the association
    await queryInterface.addConstraint('Images', {
      fields: ['employeeId'],
      type: 'foreign key',
      references: {
        table: 'Users',
        field: 'employeeId',
      },
      onDelete: 'CASCADE',
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Images', 'employeeId');
    await queryInterface.dropTable('Images');
  },
};
