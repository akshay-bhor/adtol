'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('banners', 'banner_id', Sequelize.INTEGER, {
      after: 'campaign_id'
    });
  },

  down: async (queryInterface, Sequelize) => {
  }
};
