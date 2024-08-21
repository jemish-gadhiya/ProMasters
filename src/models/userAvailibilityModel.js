'use strict';

const { from } = require("form-data");

module.exports = function (sequelize, DataTypes) {
    var UserAvailability = sequelize.define('UserAvailability', {
        user_availibility_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        from_time: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        to_time: {
            type: DataTypes.TIME,
            allowNull: false,
        },
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
        tableName: 'user_availibility',
        timestamps: false,
        underscored: true,
    });

    UserAvailability.associate = function (models) {
        // Define associations here if needed
        // For example, if there's a relationship with users:
        // UserAvailability.belongsTo(models.User, { foreignKey: 'user_id' });
    };
    
    return UserAvailability;
};
