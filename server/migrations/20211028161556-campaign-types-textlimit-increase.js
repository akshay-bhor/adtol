'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.changeColumn('campaign_types', 'name', {
      type: Sequelize.STRING(25),
      allowNull: false
    });
    queryInterface.changeColumn('campaign_types', 'desc', {
      type: Sequelize.STRING(80),
      allowNull: true
    })    
  },

  down: async (queryInterface, Sequelize) => {
   
  }
};
