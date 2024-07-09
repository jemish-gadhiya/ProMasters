'use strict';
module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true,
        },
        name: DataTypes.STRING(256),
        username: {
            type: DataTypes.STRING(256),
            unique: true,
        },
        email: {
            type: DataTypes.STRING(256),
            unique: true,
        },
        contact: DataTypes.STRING(256),
        password: DataTypes.STRING(256),
        google_signup: {
            type: DataTypes.STRING(256),
            allowNull: true,
        },
        latitude: DataTypes.STRING(256),
        longitude: DataTypes.STRING(256),
        role: {
            type: DataTypes.INTEGER, // 1-user, 2-provider, 3-handyman,
            allowNull: false,
        },
        photo: DataTypes.TEXT,
        address: DataTypes.STRING(256),
        city: DataTypes.STRING(256),
        state: DataTypes.STRING(256),
        country: DataTypes.STRING(256),
        experience: DataTypes.STRING(256),
        provider_id: DataTypes.INTEGER,
        email_otp: DataTypes.STRING(256),
        sms_otp: DataTypes.STRING(256),
        is_email_verified: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        is_sms_verified: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        is_active: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
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
        tableName: 'users',
        timestamps: false,
        underscored: true,
    });

    User.associate = function (models) {
        // Define associations here if needed
        User.hasMany(models.ProviderCommission, {
            foreignKey: 'user_id',
            targetKey: 'provider_id'
        });
    };

    return User;
};
