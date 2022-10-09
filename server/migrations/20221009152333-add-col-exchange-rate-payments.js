'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('payments', 'exchange_rate', {
      type: Sequelize.FLOAT(10, 2),
      allowNull: false,
      defaultValue: 1
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('payments', 'exchange_rate');
  }
};
