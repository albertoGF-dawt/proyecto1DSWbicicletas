import { bicycle } from "../modules/bicycles/bicycles.model";
import { Brand } from "../modules/brands/brand.model";

export function defineAssociations() {
    Brand.hasMany(bicycle, { foreignKey: "brandId", as: "bicycles" });
    bicycle.belongsTo(Brand, { foreignKey: "brandId", as: "brand" });
}