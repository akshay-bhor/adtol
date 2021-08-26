const sequelize = require('../utils/db');
const { DataTypes } = require('sequelize');

const Banners = sequelize.define('banner', {
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
    campaign_id: {
        type: DataTypes.INTEGER,
        allowNull: true
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
        },
        {
            name: 'uid',
            using: 'BTREE',
            fields: ['uid']
        }
    ]
});

module.exports = Banners;