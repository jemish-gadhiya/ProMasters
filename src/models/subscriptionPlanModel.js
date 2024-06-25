'use strict';
module.exports = function (sequelize, DataTypes) {
    var SubscriptionPlan = sequelize.define('SubscriptionPlan', {
        subscription_plan_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true,
        },
        title: DataTypes.STRING(256),
        description: DataTypes.STRING(256),
        amount: DataTypes.DOUBLE,
        is_active: DataTypes.INTEGER,
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
        tableName: 'subscription_plan',
        timestamps: false,
        underscored: true,
    });

    SubscriptionPlan.associate = function (models) {
        // Define associations here if needed
        // For example, if there's a relationship with subscriptions:
        // SubscriptionPlan.hasMany(models.Subscription, { foreignKey: 'subscription_plan_id' });
    };
    
    return SubscriptionPlan;
};
