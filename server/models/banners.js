const sequelize = require('../utils/db');
const { DataTypes } = require('sequelize');

const Banners = sequelize.define('banner', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    campaign_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    banner_id: {
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
            name: 'campaign_id',
            using: 'BTREE',
            fields: ['campaign_id']
        },
        {
            name: 'size',
            using: 'BTREE',
            fields: ['size']
        }
    ]
});

module.exports = Banners;