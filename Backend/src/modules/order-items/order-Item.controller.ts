import { Request, Response } from "express";
import { OrderItemService } from "./order-Items.service";

export class OrderItemController {
    static async getAll(req: Request, res: Response) {
        try {
            const items = await OrderItemService.getAll();
            return res.status(200).json(items);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error al obtener las líneas de pedido" });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ message: "id no válido" });
            }

            const item = await OrderItemService.getById(id);
            if (!item) {
                return res.status(404).json({ message: "Línea de pedido no encontrada" });
            }
            return res.status(200).json(item);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error al obtener la línea de pedido" });
        }
    }

    static async getByOrderId(req: Request, res: Response) {
        try {
            const orderId = Number(req.params.orderId);
            if (Number.isNaN(orderId)) {
                return res.status(400).json({ message: "orderId no válido" });
            }

            const items = await OrderItemService.findByOrderId(orderId);
            return res.status(200).json(items);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error al obtener las líneas del pedido" });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const { orderId, bicycleId, quantity, unitPrice } = req.body;

            if (!Number.isInteger(Number(orderId)) || Number(orderId) <= 0) {
                return res.status(400).json({ message: "orderId es obligatorio y debe ser un entero positivo" });
            }
            if (!Number.isInteger(Number(bicycleId)) || Number(bicycleId) <= 0) {
                return res.status(400).json({ message: "bicycleId es obligatorio y debe ser un entero positivo" });
            }
            if (!Number.isInteger(Number(quantity)) || Number(quantity) < 1) {
                return res.status(400).json({ message: "quantity debe ser un entero mayor o igual que 1" });
            }
            if (unitPrice === undefined || Number.isNaN(Number(unitPrice)) || Number(unitPrice) < 0) {
                return res.status(400).json({ message: "unitPrice es obligatorio y debe ser un número mayor o igual que 0" });
            }

            const item = await OrderItemService.create({
                orderId: Number(orderId),
                bicycleId: Number(bicycleId),
                quantity: Number(quantity),
                unitPrice: Number(unitPrice),
            });

            return res.status(201).json(item);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error al crear la línea de pedido" });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ message: "id no válido" });
            }

            const { orderId, bicycleId, quantity, unitPrice } = req.body;

            if (quantity !== undefined && (!Number.isInteger(Number(quantity)) || Number(quantity) < 1)) {
                return res.status(400).json({ message: "quantity debe ser un entero mayor o igual que 1" });
            }
            if (unitPrice !== undefined && (Number.isNaN(Number(unitPrice)) || Number(unitPrice) < 0)) {
                return res.status(400).json({ message: "unitPrice debe ser un número mayor o igual que 0" });
            }

            const item = await OrderItemService.update(id, {
                orderId: orderId !== undefined ? Number(orderId) : undefined,
                bicycleId: bicycleId !== undefined ? Number(bicycleId) : undefined,
                quantity: quantity !== undefined ? Number(quantity) : undefined,
                unitPrice: unitPrice !== undefined ? Number(unitPrice) : undefined,
            });

            if (!item) {
                return res.status(404).json({ message: "Línea de pedido no encontrada" });
            }
            return res.status(200).json(item);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error al actualizar la línea de pedido" });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ message: "id no válido" });
            }

            const deleted = await OrderItemService.delete(id);
            if (!deleted) {
                return res.status(404).json({ message: "Línea de pedido no encontrada" });
            }
            return res.status(204).send();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error al eliminar la línea de pedido" });
        }
    }
}