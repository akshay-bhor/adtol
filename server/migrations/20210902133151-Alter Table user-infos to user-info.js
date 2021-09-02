'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.renameTable('user_infos', 'user_info')
  },

  down: async (queryInterface, Sequelize) => {
  }
};
