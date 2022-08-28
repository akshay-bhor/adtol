const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const Ads = sequelize.define('ads', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    campaign_id: { // Which campaign it is part of
        type: DataTypes.INTEGER,
        allowNull: false
    },
    type: { // 1 - text, 2 - banner, 3 - native, 4 - widget, 5 - pop
        type: DataTypes.TINYINT(1),
        allowNull: false
    },
    match_hash: { // bot, status, type, adult, run
        type: DataTypes.STRING(10),
        allowNull: false
    }
},
{
    indexes:[
        {
            name: 'campaign_id',
            using: 'BTREE',
            fields: ['campaign_id']
        },
        {
            name: 'match_hash',
            using: 'BTREE',
            fields: ['match_hash']
        }
    ],
});

module.exports = Ads;