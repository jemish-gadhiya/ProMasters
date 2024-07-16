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
        commission_amount: DataTypes.DOUBLE,
        booking_status: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        booking_service_status: {
            type: DataTypes.INTEGER,
            // ENUM('pending', 'in_progress', 'completed', 'cancelled'), // Example ENUM values, adjust as needed
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
        ServiceBooking.belongsTo(models.users, { foreignKey: 'booked_by' });
        // ServiceBooking.belongsTo(models.Coupon, { foreignKey: 'coupen_id' });
    };
    
    return ServiceBooking;
};
