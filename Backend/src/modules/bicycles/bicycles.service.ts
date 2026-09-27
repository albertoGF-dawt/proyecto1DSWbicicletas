import { bicycle } from "./bicycles.model";

export class bicycleService {
    static async findAll() {
        return bicycle.findAll();
    }

    static async findById(id: number) {
        return bicycle.findByPk(id);
    }

    static async create(data: {
        brandId: number;
        model: string;
        description?: string | null;
        price: number;
        stock: number;
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        return bicycle.create(data as any);
    }

    static async update(
        bicycleItem: any,
        data: {
            brandId?: number;
            model?: string;
            description?: string | null;
            price?: number;
            stock?: number;
        }
    ) {
        return bicycleItem.update(data);
    }

    static async delete(bicycleItem: any) {
        await bicycleItem.destroy();
    }
}