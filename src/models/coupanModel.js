'use strict';
module.exports = function (sequelize, DataTypes) {
    var Coupon = sequelize.define('Coupon', {
        coupon_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true,
        },
        coupon_code: {
            type: DataTypes.STRING(256),
            allowNull: false,
        },
        coupon_amount: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
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
        tableName: 'coupon',
        timestamps: false,
        underscored: true,
    });

    Coupon.associate = function (models) {
        // Define associations here if needed
        // For example, if there's a relationship with services:
        // Coupon.hasMany(models.ServiceBooking, { foreignKey: 'coupon_id' });
    };
    
    return Coupon;
};
