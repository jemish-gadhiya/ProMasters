'use strict';
module.exports = function (sequelize, DataTypes) {
    var Notification = sequelize.define('Notification', {
        notification_id: {
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
        title: DataTypes.STRING(256),
        description: DataTypes.STRING(256),
        is_read: {
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
        tableName: 'notifications',
        timestamps: false,
        underscored: true,
    });

    Notification.associate = function (models) {
        // Define associations here if needed
        // For example, if there's a relationship with users:
        // Notification.belongsTo(models.User, { foreignKey: 'user_id' });
    };
    
    return Notification;
};
