import { Op } from "sequelize";
import { customer } from "./customers.model";
import { Order } from "../orders/orders.model";

export class CustomerService {
    static async getAll() {
        return await customer.findAll();
    }

    static async getById(id: number) {
        return await customer.findByPk(id);
    }
    static async create(data: { name: string; email: string }) {
        return await customer.create(data);
    }
    static async update(id: number, data: { name?: string; email?: string }) {
        const customerInstance = await customer.findByPk(id);
        if (!customerInstance) return null;
        return await customerInstance.update(data);
    }
    static async delete(id: number) {
        const customerInstance = await customer.findByPk(id);
        if (!customerInstance) return false;
        await customerInstance.destroy();
        return true;
    }

    static async findCustomersWithOrdersByNameSearch(nameSearch: string) {
        return customer.findAll({
            where: { name: { [Op.like]: `%${nameSearch}%` } },
            include: [{ model: Order, as: "orders", required: true }],
        });
    }
}
