import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database";

export const bicycle = sequelize.define(
    "bicycle",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        brandId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "brands",
                key: "id"
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },
        model: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        stock: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        tableName: "bicycles",
        timestamps: true,
    }
);