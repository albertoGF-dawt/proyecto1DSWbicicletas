// order-Items.service.ts
import { OrderItem } from "./order-Items.model";
import { Order } from "../orders/orders.model";
import { bicycle } from "../bicycles/bicycles.model";

export class OrderItemService {
    static async getAll() {
        return await OrderItem.findAll({
            include: [{ model: bicycle, as: "bicycle" }],
            order: [["id", "ASC"]],
        });
    }

    static async getById(id: number) {
        return await OrderItem.findByPk(id, {
            include: [
                { model: bicycle, as: "bicycle" },
                { model: Order, as: "order" },
            ],
        });
    }

    static async findByOrderId(orderId: number) {
        return await OrderItem.findAll({
            where: { orderId },
            include: [{ model: bicycle, as: "bicycle" }],
            order: [["id", "ASC"]],
        });
    }

    static async create(data: {
        orderId: number;
        bicycleId: number;
        quantity: number;
        unitPrice: number;
    }) {
        return await OrderItem.create(data);
    }

    static async update(
        id: number,
        data: { orderId?: number; bicycleId?: number; quantity?: number; unitPrice?: number }
    ) {
        const item = await OrderItem.findByPk(id);
        if (!item) return null;
        return await item.update(data);
    }

    static async delete(id: number) {
        const item = await OrderItem.findByPk(id);
        if (!item) return false;
        await item.destroy();
        return true;
    }
}