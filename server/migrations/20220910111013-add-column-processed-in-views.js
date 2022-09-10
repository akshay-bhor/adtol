'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('views', 'processed', {
      type: Sequelize.TINYINT(1),
      allowNull: false,
      defaultValue: 1
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('views', 'processed');
  }
};
