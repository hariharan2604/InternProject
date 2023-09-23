'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Credentials', {
      employeeId: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },
      userName: {
        type: Sequelize.STRING,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
      },
      isAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    await queryInterface.addConstraint('Credentials', {
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
    await queryInterface.removeConstraint('Credentials', 'employeeId');
    await queryInterface.dropTable('Credentials');
  },
};
