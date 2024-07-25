'use strict';
module.exports = function (sequelize, DataTypes) {
    var ServiceBookingHandyman = sequelize.define('ServiceBookingHandyman', {
        service_booking_handyman_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true,
        },
        service_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        service_booking_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        user_id: {
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
        tableName: 'service_booking_handyman',
        timestamps: false,
        underscored: true,
    });

    ServiceBookingHandyman.associate = function (models) {
        ServiceBookingHandyman.belongsTo(models.users, {
            foreignKey: 'user_id',
            targetKey: 'user_id'
        });
    };
    
    return ServiceBookingHandyman;
};
