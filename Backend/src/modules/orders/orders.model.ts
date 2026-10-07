import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from "sequelize";

import { sequelize } from "../../config/database";

export class Order extends Model<
    InferAttributes<Order>,
    InferCreationAttributes<Order>
> {
    declare id: CreationOptional<number>;

    declare customerId: number;

    declare orderDate: CreationOptional<Date>;

    declare status: CreationOptional<"pending" | "paid" | "shipped" | "cancelled">;

    declare createdAt: CreationOptional<Date>;

    declare updatedAt: CreationOptional<Date>;
}

Order.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        customerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        orderDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        status: {
            type: DataTypes.ENUM("pending", "paid", "shipped", "cancelled"),
            allowNull: false,
            defaultValue: "pending",
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: "orders",
        modelName: "Order",
        timestamps: true,
    }
);
