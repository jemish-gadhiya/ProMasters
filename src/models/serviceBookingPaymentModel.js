'use strict';
module.exports = function (sequelize, DataTypes) {
    var ServiceBookingPayment = sequelize.define('ServiceBookingPayment', {
        service_booking_payment_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true,
        },
        service_booking_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        payment_status: {
            type: DataTypes.INTEGER, //0 - pending, 1 - completed, 3 - failed
            defaultValue: 0,
        },
        payment_method: DataTypes.STRING(256),
        amount: DataTypes.DOUBLE,
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        description: DataTypes.TEXT,
        payment_intent_id: DataTypes.TEXT,
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
        tableName: 'service_booking_payment',
        timestamps: false,
        underscored: true,
    });

    ServiceBookingPayment.associate = function (models) {
        // Define associations here if needed
        // For example, if there's a relationship with service bookings and users:
        // ServiceBookingPayment.belongsTo(models.ServiceBooking, { foreignKey: 'service_booking_id' });
        // ServiceBookingPayment.belongsTo(models.User, { foreignKey: 'user_id' });
    };

    return ServiceBookingPayment;
};
