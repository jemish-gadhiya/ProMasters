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
        due_date: DataTypes.STRING(256),
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
        Subscription.hasMany(models.subscriptionPayment, {
            foreignKey: 'subscription_id',
            sourceKey: 'subscription_id'
        });

        Subscription.belongsTo(models.subscriptionPlan, {
            foreignKey: 'subscription_plan_id',
            targetKey: 'subscription_plan_id'
        });

    };

    return Subscription;
};
