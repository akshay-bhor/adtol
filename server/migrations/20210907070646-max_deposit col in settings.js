'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('settings', 'max_deposit', {
      type: Sequelize.FLOAT(10, 2),
      defaultValue: 5000,
      after: 'min_deposit'
    });
  },

  down: async (queryInterface, Sequelize) => {
  }
};
