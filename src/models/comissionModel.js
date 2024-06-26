'use strict';
module.exports = function (sequelize, DataTypes) {
    var Commission = sequelize.define('Commission', {
        comission_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true,
        },
        comission_amount: DataTypes.INTEGER,
        description: DataTypes.STRING, // Assuming description is a string
        is_deleted: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'comission',
        timestamps: false,
        underscored: true,
    });

    return Commission;
};
