import { BicycleDetail } from "./bicycleDetail.model";
import { bicycle } from "../bicycles/bicycles.model";

type CreateDetailInput = {
    bicycleId: number;
    frameMaterial: "Aluminium" | "Carbon" | "Steel" | "Titanium";
    wheelSize: number;
    weight: number;
    suspension?: string | null;
};

export class BicycleDetailsService {

    static async create(data: CreateDetailInput) {
        if (!data || !Number.isSafeInteger(data.bicycleId) || data.bicycleId <= 0) {
            throw new Error("A valid bicycleId is required");
        }

        const existingBicycle = await bicycle.findByPk(data.bicycleId);
        if (!existingBicycle) throw new Error("The bicycle does not exist");

        const existingDetail = await BicycleDetail.findOne({
            where: { bicycleId: data.bicycleId },
        });
        if (existingDetail) throw new Error("The bicycle already has a technical specification");

        return BicycleDetail.create(data);
    }

    static async getById(id: number) {
        return await BicycleDetail.findByPk(id);
    }

    static async getAll() {
        return await BicycleDetail.findAll();
    }

    // Devuelve null si no existe (el controller responde 404)
    static async update(id: number, data: Partial<CreateDetailInput>) {
        const detail = await BicycleDetail.findByPk(id);
        if (!detail) return null;

        // bicycleId no se puede cambiar: se descarta si viene en el body
        const { bicycleId: _ignored, ...rest } = data;
        return await detail.update(rest);
    }

    // Devuelve false si no existe (el controller responde 404)
    static async delete(id: number) {
        const detail = await BicycleDetail.findByPk(id);
        if (!detail) return false;

        await detail.destroy();
        return true;
    }
}