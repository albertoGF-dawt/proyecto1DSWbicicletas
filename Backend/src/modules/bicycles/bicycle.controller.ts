import { Request, Response, NextFunction } from "express";
import { bicycleService } from "./bicycles.service";
export class bicycleController {
    static async getAll(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const bicycles = await bicycleService.findAll();
            res.json(bicycles);
        } catch (error) {
            next(error);
        }
    }
    static async getById(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const id = Number(req.params.id);
            const bicycle = await bicycleService.findEagerlyById(id);
            if (!bicycle) {
                res.status(404).json({
                    message: "bicycleo no encontrado",
                });
                return;
            }
            res.json(bicycle);
        } catch (error) {
            next(error);
        }
    }
    static async create(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { brand, model, description, price, stock } = req.body;
            if (!brand || !model || price === undefined) {
                res.status(400).json({
                    message: "brand, model y price son obligatorios",
                });
                return;
            }
            const bicycle = await bicycleService.create({
                brandId: brand,
                model,
                description,
                price,
                stock,
            });
            res.status(201).json(bicycle);
        } catch (error) {
            next(error);
        }
    }
    static async update(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const id = Number(req.params.id);
            const bicycle = await bicycleService.findById(id);
            if (!bicycle) {
                res.status(404).json({
                    message: "bicycleo no encontrado",
                });
                return;
            }
            const { brand, model, description, price, stock } = req.body;
            const updatedbicycle = await bicycleService.update(
                bicycle,
                {
                    ...(brand !== undefined && { brandId: brand }),
                    ...(model !== undefined && { model }),
                    ...(description !== undefined && { description }),
                    ...(price !== undefined && { price }),
                    ...(stock !== undefined && { stock }),
                }
            );
            res.json(updatedbicycle);
        } catch (error) {
            next(error);
        }
    }
    static async delete(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const id = Number(req.params.id);
            const bicycle = await bicycleService.findById(id);
            if (!bicycle) {
                res.status(404).json({
                    message: "bicycleta no encontrada",
                });
                return;
            }
            await bicycleService.delete(bicycle);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}