'use strict';
module.exports = function (sequelize, DataTypes) {
    var UserLoginLog = sequelize.define('UserLoginLog', {
        login_logs_id: {
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
        device_token: DataTypes.STRING(256),
        device_info: DataTypes.STRING(256),
        platform: DataTypes.STRING(256),
        access_token: DataTypes.STRING(256),
        is_logout: {
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
        tableName: 'user_login_logs',
        timestamps: false,
        underscored: true,
    });

    UserLoginLog.associate = function (models) {
        // Define associations here if needed
        // For example, if there's a relationship with users:
        // LoginLog.belongsTo(models.User, { foreignKey: 'user_id' });
    };
    return UserLoginLog;
};
