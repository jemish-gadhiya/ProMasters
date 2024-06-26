'use strict';
module.exports = function (sequelize, DataTypes) {
    var ServiceAttachment = sequelize.define('ServiceAttachment', {
        service_attachment_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true,
        },
        service_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        url: DataTypes.STRING(256),
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
        tableName: 'service_attachments',
        timestamps: false,
        underscored: true,
    });

    ServiceAttachment.associate = function (models) {
        // Define associations here if needed
        // For example, if there's a relationship with services:
        // ServiceAttachment.belongsTo(models.Service, { foreignKey: 'service_id' });
    };
    
    return ServiceAttachment;
};
