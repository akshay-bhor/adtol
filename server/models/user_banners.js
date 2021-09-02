const sequelize = require('../utils/db');
const { DataTypes } = require('sequelize');

const User_Banners = sequelize.define('user_banner', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    uid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    size: {
        type: DataTypes.INTEGER(2),
        allowNull: false
    },
    src: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    indexes: [
        {
            name: 'uid',
            using: 'BTREE',
            fields: ['uid']
        }
    ]
});

module.exports = User_Banners;