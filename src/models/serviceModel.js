'use strict';
module.exports = function (sequelize, DataTypes) {
    var Service = sequelize.define('Service', {
        service_id: {
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
        name: DataTypes.STRING(256),
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        service_address_id: DataTypes.STRING(256),
        service_type: DataTypes.STRING(256),
        status: {
            type: DataTypes.ENUM('pending', 'active', 'inactive', 'completed', 'cancelled'), // Example ENUM values, adjust as needed
            allowNull: false,
        },
        price: DataTypes.DOUBLE,
        discount: DataTypes.DOUBLE,
        duration_hours: DataTypes.INTEGER,
        duration_mins: DataTypes.INTEGER,
        description: DataTypes.STRING(256),
        image_link: DataTypes.STRING(256),
        is_featured: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
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
        tableName: 'services',
        timestamps: false,
        underscored: true,
    });

    Service.associate = function (models) {
      
    };
    
    return Service;
};
