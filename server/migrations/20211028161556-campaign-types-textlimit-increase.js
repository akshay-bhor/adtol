'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.changeColumn('campaign_types', 'name', {
      type: Sequelize.STRING(30),
      allowNull: false
    });
    queryInterface.changeColumn('campaign_types', 'desc', {
      type: Sequelize.STRING(200),
      allowNull: true
    })    
  },

  down: async (queryInterface, Sequelize) => {
   
  }
};
