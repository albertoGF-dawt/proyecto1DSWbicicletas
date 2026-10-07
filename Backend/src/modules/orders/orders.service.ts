import { Order } from "./orders.model";
import { customer } from "../customers/customers.model";

export class OrderService {
    static async getAll() {
        return await Order.findAll(
            {
                include: [{ model: customer, as: "customer", attributes: ["id", "name", "email"] }],
                order: [["orderDate", "DESC"]],
            }
        );
    }

    static async findByCustomerId(customerId: number) {
        return Order.findAll({
            where: { customerId },
            include: [{ model: customer, as: "customer", attributes: ["id", "name", "email"] }],
            order: [["orderDate", "DESC"]],
        });
    }

    static async getById(id: number) {
        return Order.findByPk(id, {
            include: [{ model: customer, as: "customer", attributes: ["id", "name", "email"] }],
        });
    }

    static async create(data: { customerId: number; orderDate?: Date; status?: "pending" | "paid" | "shipped" | "cancelled" }) {
        return Order.create(data);
    }
    static async update(id: number, data: { customerId?: number; orderDate?: Date; status?: "pending" | "paid" | "shipped" | "cancelled" }) {
        const order = await Order.findByPk(id);
        if (!order) return null;
        return await order.update(data);
    }
    static async delete(id: number) {
        const order = await Order.findByPk(id);
        if (!order) return false;
        await order.destroy();
        return true;
    }
}