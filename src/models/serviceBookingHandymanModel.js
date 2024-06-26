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
        // Define associations here if needed
        // For example, if there's a relationship with services and users:
        // ServiceBookingHandyman.belongsTo(models.Service, { foreignKey: 'service_id' });
        // ServiceBookingHandyman.belongsTo(models.User, { foreignKey: 'user_id' });
    };
    
    return ServiceBookingHandyman;
};
