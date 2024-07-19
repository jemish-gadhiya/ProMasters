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
            type: DataTypes.INTEGER, //(0 -'pending',1- 'active',2- 'inactive',3- 'completed',5- 'cancelled'),
            defaultValue: 0,
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
        Service.hasMany(models.serviceAttachment, {
            foreignKey: 'service_id',
            sourceKey: 'service_id'
        });
        Service.hasMany(models.serviceBooking, {
            foreignKey: 'service_id',
            sourceKey: 'service_id'
        });
        Service.belongsTo(models.users, {
            foreignKey: 'user_id',
            targetKey: 'user_id'
        });
        Service.belongsTo(models.category, {
            foreignKey: 'category_id',
            targetKey: 'category_id'
        });
        Service.belongsTo(models.serviceBookingHandyman, {
            foreignKey: 'service_id',
            targetKey: 'service_id'
        });
        Service.hasMany(models.serviceRating, {
            as: "service_rating",
            foreignKey: 'rating_reciever_id',
            sourceKey: 'service_id'
        });
    };

    return Service;
};
