import { bicycle } from "../modules/bicycles/bicycles.model";
import { Brand } from "../modules/brands/brand.model";
import { BicycleDetail } from "../modules/bicycleDetails/bicycleDetail.model";

export function defineAssociations() {
    Brand.hasMany(bicycle, { foreignKey: "brandId", as: "bicycles" });
    bicycle.belongsTo(Brand, { foreignKey: "brandId", as: "brand" });
    bicycle.hasOne(BicycleDetail, { foreignKey: "bicycleId", as: "detail", onDelete: "CASCADE" });
    BicycleDetail.belongsTo(bicycle, { foreignKey: "bicycleId", as: "bicycle" });
}

