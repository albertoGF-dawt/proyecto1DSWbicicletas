// orders.controller.ts
import { Request, Response } from "express";
import { OrderService } from "./orders.service";

const VALID_STATUS = ["pending", "paid", "shipped", "cancelled"] as const;
type OrderStatus = (typeof VALID_STATUS)[number];

export class OrderController {
    static async getAll(req: Request, res: Response) {
        try {
            const orders = await OrderService.getAll();
            return res.status(200).json(orders);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error al obtener los pedidos" });
        }
    }

    static async getByCustomerId(req: Request, res: Response) {
        try {
            const customerId = Number(req.params.customerId);
            if (Number.isNaN(customerId)) {
                return res.status(400).json({ message: "customerId no válido" });
            }

            const orders = await OrderService.findByCustomerId(customerId);
            return res.status(200).json(orders);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error al obtener los pedidos del cliente" });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ message: "id no válido" });
            }

            const order = await OrderService.getById(id);
            if (!order) {
                return res.status(404).json({ message: "Pedido no encontrado" });
            }
            return res.status(200).json(order);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error al obtener el pedido" });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const { customerId, orderDate, status } = req.body;

            if (!customerId || Number.isNaN(Number(customerId))) {
                return res.status(400).json({ message: "customerId es obligatorio y debe ser numérico" });
            }
            if (status && !VALID_STATUS.includes(status)) {
                return res.status(400).json({ message: `status debe ser uno de: ${VALID_STATUS.join(", ")}` });
            }

            const order = await OrderService.create({
                customerId: Number(customerId),
                orderDate: orderDate ? new Date(orderDate) : undefined,
                status: status as OrderStatus | undefined,
            });

            return res.status(201).json(order);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error al crear el pedido" });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ message: "id no válido" });
            }

            const { customerId, orderDate, status } = req.body;
            if (status && !VALID_STATUS.includes(status)) {
                return res.status(400).json({ message: `status debe ser uno de: ${VALID_STATUS.join(", ")}` });
            }

            const order = await OrderService.update(id, {
                customerId: customerId !== undefined ? Number(customerId) : undefined,
                orderDate: orderDate ? new Date(orderDate) : undefined,
                status,
            });

            if (!order) {
                return res.status(404).json({ message: "Pedido no encontrado" });
            }
            return res.status(200).json(order);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error al actualizar el pedido" });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ message: "id no válido" });
            }

            const deleted = await OrderService.delete(id);
            if (!deleted) {
                return res.status(404).json({ message: "Pedido no encontrado" });
            }
            return res.status(204).send();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error al eliminar el pedido" });
        }
    }
}