'use strict';
module.exports = function (sequelize, DataTypes) {
    var ApiLogs = sequelize.define('ApiLogs', {
        api_log_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true,
        },
        api_name: DataTypes.STRING(256),
        request: DataTypes.TEXT,
        response: DataTypes.TEXT,
        user_id: DataTypes.INTEGER,
        execution_time: DataTypes.TEXT,
        created_at: DataTypes.DATE(),
    }, {
        tableName: 'ApiLogs',
        timestamps: false,
        underscored: true,
    });

    ApiLogs.associate = function (models) {

    };

    return ApiLogs;
};