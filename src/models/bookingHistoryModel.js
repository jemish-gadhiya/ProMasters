'use strict';
module.exports = function (sequelize, DataTypes) {
    var BookingHistory = sequelize.define('BookingHistory', {
        booking_history_id: {
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
        assignedTo: {
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
        tableName: 'booking_history',
        timestamps: false,
        underscored: true,
    });

    BookingHistory.associate = function (models) {
        // Define associations here if needed
        // For example, if there's a relationship with service bookings and users:
        // BookingHistory.belongsTo(models.ServiceBooking, { foreignKey: 'service_booking_id' });
        // BookingHistory.belongsTo(models.User, { foreignKey: 'assignedTo' });
    };
    
    return BookingHistory;
};
