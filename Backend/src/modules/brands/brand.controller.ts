import { Request, Response } from 'express';
import { BrandService } from './brand.service';

const brandService = new BrandService();

export class BrandController {
    async getAll(req: Request, res: Response) {
        try {
            const brands = await brandService.getAll();
            res.json(brands);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener marcas', error });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const brand = await brandService.getById(Number(req.params.id));
            if (!brand) return res.status(404).json({ message: 'Marca no encontrada' });
            res.json(brand);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener marca', error });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const brand = await brandService.create(req.body);
            res.status(201).json(brand);
        } catch (error) {
            res.status(500).json({ message: 'Error al crear marca', error });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const brand = await brandService.update(Number(req.params.id), req.body);
            if (!brand) return res.status(404).json({ message: 'Marca no encontrada' });
            res.json(brand);
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar marca', error });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const deleted = await brandService.delete(Number(req.params.id));
            if (!deleted) return res.status(404).json({ message: 'Marca no encontrada' });
            res.json({ message: 'Marca eliminada correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar marca', error });
        }
    }
}