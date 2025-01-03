const sequelize = require('../utils/db');
const { DataTypes } = require('sequelize');

const Ref_Stats = sequelize.define('ref_stats', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    ref_uid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    earned: {
        type: DataTypes.FLOAT(15, 5),
        allowNull: false,
        defaultValue: 0
    },
    day_unix: {
        type: DataTypes.BIGINT(10),
        allowNull: false
    }
},
{
    indexes: [
        {
            name: "ref_uid",
            using: "BTREE",
            fields: ['ref_uid']
        }
    ]
});

module.exports = Ref_Stats;