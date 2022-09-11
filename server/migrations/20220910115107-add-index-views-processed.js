'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addIndex('views', ['processed', 'time_unix']);
  },

  async down (queryInterface, Sequelize) {
    
  }
};
