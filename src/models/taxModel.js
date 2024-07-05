'use strict';
module.exports = function (sequelize, DataTypes) {
    var Tax = sequelize.define('Tax', {
        tax_id: {
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
        tax_name: DataTypes.STRING(256),
        tax_amount: DataTypes.DOUBLE,
        tax_amount_type: {
            type: DataTypes.INTEGER, // 1-fixed, 2-percentage
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
        tableName: 'taxes',
        timestamps: false,
        underscored: true,
    });

    Tax.associate = function (models) {
        // Define associations here if needed
        // For example, if there's a relationship with users:
        // Tax.belongsTo(models.User, { foreignKey: 'user_id' });
    };

    return Tax;
};
