'use strict';
module.exports = function (sequelize, DataTypes) {
    var FavouritedService = sequelize.define('FavouritedService', {
        favourited_service_id: {
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
        service_id: {
            type: DataTypes.INTEGER,
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
        tableName: 'favourited_service',
        timestamps: false,
        underscored: true,
    });

    FavouritedService.associate = function (models) {
        // Define associations here if needed
        // For example, if there's a relationship with users and services:
        FavouritedService.belongsTo(models.User, { foreignKey: 'user_id' });
        FavouritedService.belongsTo(models.Service, { foreignKey: 'service_id' });
    };
    
    return FavouritedService;
};
