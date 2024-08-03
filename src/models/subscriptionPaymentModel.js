'use strict';
module.exports = function (sequelize, DataTypes) {
    var SubscriptionPayment = sequelize.define('SubscriptionPayment', {
        subscription_payment_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true,
        },
        subscription_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        payment_type: DataTypes.STRING(256),
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 0 // 0-fail, 1- success
        },
        transaction_id: DataTypes.STRING(256),
        receipt: DataTypes.STRING(256),
        card_details: DataTypes.TEXT,
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
        tableName: 'subscription_payment',
        timestamps: false,
        underscored: true,
    });

    SubscriptionPayment.associate = function (models) {
        // Define associations here if needed
        // For example, if there's a relationship with subscriptions:
        // SubscriptionPayment.belongsTo(models.Subscription, { foreignKey: 'subscription_id' });
    };

    return SubscriptionPayment;
};
