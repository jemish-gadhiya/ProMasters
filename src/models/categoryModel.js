'use strict';
module.exports = function (sequelize, DataTypes) {
    var Category = sequelize.define('Category', {
        category_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true,
        },
        name: DataTypes.STRING(256),
        image: DataTypes.STRING(256),
        is_enable: DataTypes.TINYINT,
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
        tableName: 'category',
        timestamps: false,
        underscored: true,
    });

    Category.associate = function (models) {
        // Define associations here if needed
    };
    
    return Category;
};
