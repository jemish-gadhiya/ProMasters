'use strict';
module.exports = function (sequelize, DataTypes) {
    var Wallet = sequelize.define('Wallet', {
        wallet_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true,
        },
        provider_id: DataTypes.INTEGER,
        service_id: DataTypes.INTEGER,
        amount: DataTypes.DOUBLE,
        status: {// 1-success, 0-fail
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },
        is_paid_by_admin: {
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
        tableName: 'wallet',
        timestamps: false,
        underscored: true,
    });

    Wallet.associate = function (models) {
        Wallet.hasMany(models.service, {
            foreignKey: 'service_id',
            sourceKey: 'service_id'
        });
    };

    return Wallet;
};
