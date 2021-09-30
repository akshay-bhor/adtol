const sequelize = require('../utils/db');
const { DataTypes } = require('sequelize');

const Pub_Sites = sequelize.define('pub_sites', {
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
    domain: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    hash: {
        type: DataTypes.STRING(12),
        unique: true,
        allowNull: false
    },
    category: {
        type: DataTypes.INTEGER(1),
        allowNull: false
    },
    language: {
        type: DataTypes.INTEGER(2),
        allowNull: false
    },
    traffic: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    adult: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: 0
    },
    views: {
        type: DataTypes.BIGINT(12),
        allowNull: false,
        defaultValue: 0
    },
    clicks: {
        type: DataTypes.BIGINT(12),
        allowNull: false,
        defaultValue: 0
    },
    pops: {
        type: DataTypes.BIGINT(12),
        allowNull: false,
        defaultValue: 0
    },
    earned: {
        type: DataTypes.FLOAT(15, 5),
        allowNull: false,
        defaultValue: 0
    },
    status: { // 1 Approved 2 pending 3 rejected
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 2
    }
}, {
    indexes: [
        {
            name: 'uid',
            using: 'BTREE',
            fields: ['uid']
        },
        {
            name: 'domain_hash',
            using: 'BTREE',
            fields: ['hash']
        }
    ]
});

module.exports = Pub_Sites;