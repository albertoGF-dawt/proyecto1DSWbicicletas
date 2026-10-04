import { Request, Response } from "express";
import { BicycleDetailsService } from "./bicycleDetail.service";
import { BicycleDetail } from "./bicycleDetail.model";
import { bicycle } from "../bicycles/bicycles.model";

type FrameMaterial = "Aluminium" | "Carbon" | "Steel" | "Titanium";

// Los objetos Error no se serializan con JSON, así que enviamos solo el mensaje
const errorMessage = (error: unknown) =>
    error instanceof Error ? error.message : error;

// Convierte el parámetro de la URL en un id válido, o null si no lo es
const parseId = (value: unknown): number | null => {
    const id = Number(value);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
};

// Lógica común de los filtros por material
const findBicyclesByMaterial = (frameMaterial: FrameMaterial) =>
    bicycle.findAll({
        include: [{
            model: BicycleDetail,
            as: "detail",
            where: { frameMaterial },
            required: true,
        }],
    });

export class BicycleDetailController {

    async create(req: Request, res: Response) {
        try {
            const detail = await BicycleDetailsService.create(req.body);
            res.status(201).json(detail);
        } catch (error) {
            res.status(500).json({ message: "cannot create technical detail", error: errorMessage(error) });
        }
    }

    // Bicicleta con su ficha
    async getBicycleWithDetail(req: Request, res: Response) {
        try {
            const include = [{ model: BicycleDetail, as: "detail" }];
            const idParam = req.params.id;

            if (idParam === undefined) {
                const bicycles = await bicycle.findAll({ include });
                return res.json(bicycles);
            }

            const id = parseId(idParam);
            if (id === null) {
                return res.status(400).json({ message: "A valid bicycle ID is required" });
            }

            const bicycleWithDetail = await bicycle.findByPk(id, { include });
            if (!bicycleWithDetail) {
                return res.status(404).json({ message: "Bicycle not found" });
            }
            return res.json(bicycleWithDetail);
        } catch (error) {
            return res.status(500).json({ message: "cannot get bicycle with detail", error: errorMessage(error) });
        }
    }

    async getcarbonbicycles(req: Request, res: Response) {
        try {
            const bicycles = await findBicyclesByMaterial("Carbon");
            res.json(bicycles);
        } catch (error) {
            res.status(500).json({ message: "cannot get carbon bicycles", error: errorMessage(error) });
        }
    }

    async getsteelbicycles(req: Request, res: Response) {
        try {
            const bicycles = await findBicyclesByMaterial("Steel");
            res.json(bicycles);
        } catch (error) {
            res.status(500).json({ message: "cannot get steel bicycles", error: errorMessage(error) });
        }
    }

    async getaluminiumbicycles(req: Request, res: Response) {
        try {
            const bicycles = await findBicyclesByMaterial("Aluminium");
            res.json(bicycles);
        } catch (error) {
            res.status(500).json({ message: "cannot get aluminium bicycles", error: errorMessage(error) });
        }
    }

    async gettittaniumbicycles(req: Request, res: Response) {
        try {
            const bicycles = await findBicyclesByMaterial("Titanium");
            res.json(bicycles);
        } catch (error) {
            res.status(500).json({ message: "cannot get titanium bicycles", error: errorMessage(error) });
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const details = await BicycleDetailsService.getAll();
            res.json(details);
        } catch (error) {
            res.status(500).json({ message: "cannot get technical details", error: errorMessage(error) });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const id = parseId(req.params.id);
            if (id === null) return res.status(400).json({ message: "Invalid id" });

            const detail = await BicycleDetailsService.getById(id);
            if (!detail) return res.status(404).json({ message: "Technical detail not found" });
            res.json(detail);
        } catch (error) {
            res.status(500).json({ message: "cannot get technical detail", error: errorMessage(error) });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = parseId(req.params.id);
            if (id === null) return res.status(400).json({ message: "Invalid id" });

            const detail = await BicycleDetailsService.update(id, req.body);
            if (!detail) return res.status(404).json({ message: "Technical detail not found" });
            res.json(detail);
        } catch (error) {
            res.status(500).json({ message: "cannot update technical detail", error: errorMessage(error) });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = parseId(req.params.id);
            if (id === null) return res.status(400).json({ message: "Invalid id" });

            const deleted = await BicycleDetailsService.delete(id);
            if (!deleted) return res.status(404).json({ message: "Technical detail not found" });
            res.json({ message: "Technical detail deleted" });
        } catch (error) {
            res.status(500).json({ message: "cannot delete technical detail", error: errorMessage(error) });
        }
    }
}