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
        payment_type: {
            type: DataTypes.ENUM('credit_card', 'debit_card', 'paypal', 'stripe', 'other'), // Example ENUM values, adjust as needed
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: {
                isIn: [[0, 1]], // Validate status field against specific values
            },
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
