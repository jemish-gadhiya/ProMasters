'use strict';
module.exports = function (sequelize, DataTypes) {
    var ProviderCommission = sequelize.define('ProviderCommission', {
        provider_comission_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true,
        },
        comission_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        provider_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
        tableName: 'provider_comission',
        timestamps: false,
        underscored: true,
    });

    ProviderCommission.associate = function (models) {
        // Define associations here if needed
        // For example, if there's a relationship with providers or commissions:

        // ProviderCommission.belongsTo(models.users, { foreignKey: 'provider_id' });
        // ProviderCommission.belongsTo(models.comission, { foreignKey: 'provider_id' });

        // providerCommission.belongsTo(models.users, {
        //     foreignKey: 'user_id',
        //     targetKey: 'provider_id'
        // });

        providerCommission.belongsTo(models.comission, {
            foreignKey: 'comission_id',
            targetKey: 'comission_id'
        });

    };

    return ProviderCommission;
};
