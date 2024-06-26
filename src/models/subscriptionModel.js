'use strict';
module.exports = function (sequelize, DataTypes) {
    var Subscription = sequelize.define('Subscription', {
        subscription_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        subscription_plan_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        amount: DataTypes.DOUBLE,
        due_date: DataTypes.DATE,
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
        tableName: 'subscription',
        timestamps: false,
        underscored: true,
    });

    Subscription.associate = function (models) {
        // Define associations here if needed
        // For example, if there's a relationship with users and subscription plans:
        // Subscription.belongsTo(models.User, { foreignKey: 'user_id' });
        // Subscription.belongsTo(models.SubscriptionPlan, { foreignKey: 'subscription_plan_id' });
    };
    
    return Subscription;
};
