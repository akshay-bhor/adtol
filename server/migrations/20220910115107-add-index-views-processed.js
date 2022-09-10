'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addIndex('views', ['processed']);
  },

  async down (queryInterface, Sequelize) {
    
  }
};
