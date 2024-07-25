'use strict';
module.exports = function (sequelize, DataTypes) {
    var ServiceBooking = sequelize.define('ServiceBooking', {
        service_booking_id: {
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
        booking_no: {
            type: DataTypes.STRING(256),
            unique: true,
        },
        booked_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        booking_datetime: DataTypes.STRING(256),
        booking_address: DataTypes.STRING(256),
        booking_address_latitude: DataTypes.STRING(256),
        booking_address_longitude: DataTypes.STRING(256),
        booking_service_qty: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },
        coupen_id: DataTypes.INTEGER,
        service_amount: DataTypes.DOUBLE,
        tax_amount: {
            type: DataTypes.DOUBLE,
            defaultValue: 1,
        },
        discount_amount: {
            type: DataTypes.DOUBLE,
            defaultValue: 1,
        },
        commission_amount: {
            type: DataTypes.DOUBLE,
            defaultValue: 1,
        },
        coupen_amount: {
            type: DataTypes.DOUBLE,
            defaultValue: 1,
        },
        booking_status: {
            type: DataTypes.INTEGER,// 0-pending, 1- accept, 2-reject
            defaultValue: 0,
        },
        booking_service_status: {//0 - pending, 1- in_progress, 2- completed,3- cancelled
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        booking_service_status_updated_by: {
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
        tableName: 'service_booking',
        timestamps: false,
        underscored: true,
    });

    ServiceBooking.associate = function (models) {
        // Define associations here if needed
        // For example, if there's a relationship with services, users, and coupons:
        // ServiceBooking.belongsTo(models.Service, { foreignKey: 'service_id' });
        // ServiceBooking.belongsTo(models.User, { foreignKey: 'booked_by' });
        // ServiceBooking.belongsTo(models.Coupon, { foreignKey: 'coupen_id' });

        ServiceBooking.belongsTo(models.service, {
            foreignKey: 'service_id',
            targetKey: 'service_id'
        });

        ServiceBooking.belongsTo(models.users, {
            foreignKey: 'booked_by',
            targetKey: 'user_id'
        });

        ServiceBooking.hasMany(models.serviceBookingPayment, {
            foreignKey: 'service_booking_id',
            targetKey: 'service_booking_id'
        });

        ServiceBooking.hasMany(models.serviceBookingHandyman, {
            foreignKey: 'service_booking_id',
            targetKey: 'service_booking_id'
        });


    };

    return ServiceBooking;
};
