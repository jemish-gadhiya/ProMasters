'use strict';
module.exports = function (sequelize, DataTypes) {
    var ServiceAddress = sequelize.define('ServiceAddress', {
        service_address_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true,
        },
        address: DataTypes.STRING(256),
        latitude: DataTypes.STRING(256),
        longitude: DataTypes.STRING(256),
        is_active: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
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
        tableName: 'service_address',
        timestamps: false,
        underscored: true,
    });

    ServiceAddress.associate = function (models) {
        // Define associations here if needed
    };
    
    return ServiceAddress;
};
