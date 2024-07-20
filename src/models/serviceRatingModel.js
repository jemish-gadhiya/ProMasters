'use strict';
module.exports = function (sequelize, DataTypes) {
    var ServiceRating = sequelize.define('ServiceRating', {
        service_rating_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true,
        },
        rating_reciever_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        rating: DataTypes.DOUBLE,
        rating_type: {
            type: DataTypes.INTEGER,// 1- service', 2- 'provider', 3- 'handyman'
            defaultValue: 1,
        },
        description: DataTypes.STRING(256),
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
        tableName: 'service_ratings',
        timestamps: false,
        underscored: true,
    });

    ServiceRating.associate = function (models) {
        ServiceRating.belongsTo(models.users, {
            foreignKey: 'user_id',
            targetKey: 'user_id'
        });
        ServiceRating.belongsTo(models.service, {
            foreignKey: 'rating_reciever_id',
            targetKey: 'service_id'
        });
    };

    return ServiceRating;
};
