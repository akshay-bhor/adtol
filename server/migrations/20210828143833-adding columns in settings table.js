'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('settings', 'min_cpc', Sequelize.FLOAT(10, 5), {
      after: 'ref_commision'
    });
    await queryInterface.addColumn('settings', 'min_budget', Sequelize.FLOAT(15, 5), {
      after: 'min_cpc'
    })
    await queryInterface.addColumn('settings', 'min_daily_budget', Sequelize.FLOAT(15, 5), {
      after: 'min_budget'
    })
  },

  down: async (queryInterface, Sequelize) => {
  }
};
