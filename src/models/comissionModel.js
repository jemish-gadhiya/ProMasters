'use strict';
module.exports = function (sequelize, DataTypes) {
    var Commission = sequelize.define('Commission', {
        comission_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true,
        },
        comission_amount: DataTypes.INTEGER,
        comission_amount_type: {
            type: DataTypes.INTEGER, // 1-fixed, 2-percentage
            defaultValue: 1,
        },
        description: DataTypes.STRING, // Assuming description is a string
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
        tableName: 'comission',
        timestamps: false,
        underscored: true,
    });

    Commission.associate = function (models) {
        Commission.hasMany(models.providerComission, {
            foreignKey: 'comission_id',
            targetKey: 'comission_id'
        });
    };

    return Commission;
};
