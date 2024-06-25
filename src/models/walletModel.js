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
        status: DataTypes.INTEGER,
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
        // Define associations here if needed
        // For example, if there's a relationship with providers or services:
        // Wallet.belongsTo(models.Provider, { foreignKey: 'provider_id' });
        // Wallet.belongsTo(models.Service, { foreignKey: 'service_id' });
    };
    
    return Wallet;
};
