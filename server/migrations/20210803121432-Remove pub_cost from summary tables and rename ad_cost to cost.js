'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('summary_browser', 'pub_cost');
    await queryInterface.removeColumn('summary_os', 'pub_cost', );
    await queryInterface.removeColumn('summary_country', 'pub_cost', );
    await queryInterface.removeColumn('summary_device', 'pub_cost', );

    await queryInterface.renameColumn('summary_browser', 'ad_cost', 'cost');
    await queryInterface.renameColumn('summary_os', 'ad_cost', 'cost');
    await queryInterface.renameColumn('summary_country', 'ad_cost', 'cost');
    await queryInterface.renameColumn('summary_device', 'ad_cost', 'cost');
  },

  down: async (queryInterface, Sequelize) => {
  }
};
