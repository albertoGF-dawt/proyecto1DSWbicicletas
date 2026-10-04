import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../../config/database";

export class BicycleDetail extends Model<
    InferAttributes<BicycleDetail>, InferCreationAttributes<BicycleDetail>
> {
    declare id: CreationOptional<number>;
    declare bicycleId: number;
    declare frameMaterial: "Aluminium" | "Carbon" | "Steel" | "Titanium";
    declare wheelSize: number;
    declare weight: number;
    declare suspension: CreationOptional<string | null>;
}
BicycleDetail.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    bicycleId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    frameMaterial: {
        type: DataTypes.ENUM("Aluminium", "Carbon", "Steel", "Titanium"),
        allowNull: false,
        validate: { isIn: [["Aluminium", "Carbon", "Steel", "Titanium"]] },
    },
    wheelSize: { type: DataTypes.DECIMAL(4, 1), allowNull: false },
    weight: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
    suspension: { type: DataTypes.STRING(80), allowNull: true },
}, { sequelize, tableName: "bicycle_details", modelName: "BicycleDetail" });