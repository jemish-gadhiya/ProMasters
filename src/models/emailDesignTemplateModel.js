'use strict';
module.exports = function (sequelize, DataTypes) {
    var EmailDesignTemplate = sequelize.define('EmailDesignTemplate', {
        email_design_template_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true,
        },
        title: DataTypes.STRING(256),
        template_html_text: DataTypes.TEXT,
        subject: DataTypes.STRING(512),
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
        tableName: 'email_design_template',
        timestamps: false,
        underscored: true,
    });

    EmailDesignTemplate.associate = function (models) {
        // Define associations here if needed
        // For example, if there's a relationship with providers or services:
        // Wallet.belongsTo(models.Provider, { foreignKey: 'provider_id' });
        // Wallet.belongsTo(models.Service, { foreignKey: 'service_id' });
    };

    return EmailDesignTemplate;
};
