// customers.controller.ts
import { Request, Response } from "express";
import { CustomerService } from "./customers.service";

export class CustomerController {
    static async getAll(req: Request, res: Response) {
        try {
            const customers = await CustomerService.getAll();
            return res.status(200).json(customers);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error al obtener los clientes" });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ message: "id no válido" });
            }

            const customer = await CustomerService.getById(id);
            if (!customer) {
                return res.status(404).json({ message: "Cliente no encontrado" });
            }
            return res.status(200).json(customer);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error al obtener el cliente" });
        }
    }

    static async getCustomersWithOrdersByNameSearch(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const nameSearch = String(req.params.name_search);
            const customers = await CustomerService.findCustomersWithOrdersByNameSearch(nameSearch);

            res.json(customers);
        } catch (error) {
            next(error);
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const { name, email } = req.body;

            if (!name || typeof name !== "string") {
                return res.status(400).json({ message: "name es obligatorio" });
            }
            if (!email || typeof email !== "string") {
                return res.status(400).json({ message: "email es obligatorio" });
            }

            const customer = await CustomerService.create({ name, email });
            return res.status(201).json(customer);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error al crear el cliente" });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ message: "id no válido" });
            }

            const { name, email } = req.body;
            if (name !== undefined && typeof name !== "string") {
                return res.status(400).json({ message: "name debe ser texto" });
            }
            if (email !== undefined && typeof email !== "string") {
                return res.status(400).json({ message: "email debe ser texto" });
            }

            const customer = await CustomerService.update(id, { name, email });
            if (!customer) {
                return res.status(404).json({ message: "Cliente no encontrado" });
            }
            return res.status(200).json(customer);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error al actualizar el cliente" });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ message: "id no válido" });
            }

            const deleted = await CustomerService.delete(id);
            if (!deleted) {
                return res.status(404).json({ message: "Cliente no encontrado" });
            }
            return res.status(204).send();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error al eliminar el cliente" });
        }
    }
}