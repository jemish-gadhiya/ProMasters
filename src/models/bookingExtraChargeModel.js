'use strict';
module.exports = function (sequelize, DataTypes) {
    var BookingExtraCharge = sequelize.define('BookingExtraCharge', {
        booking_extra_charge_id: {
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
        title: DataTypes.STRING(256),
        description: DataTypes.STRING(256),
    }, {
        tableName: 'booking_extra_charges',
        timestamps: false,
        underscored: true,
    });

    BookingExtraCharge.associate = function (models) {
        // Define associations here if needed
        // For example, if there's a relationship with service bookings:
        // BookingExtraCharge.belongsTo(models.ServiceBooking, { foreignKey: 'service_booking_id' });
    };
    
    return BookingExtraCharge;
};
