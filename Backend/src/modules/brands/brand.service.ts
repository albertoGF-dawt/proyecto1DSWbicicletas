import { Brand } from './brand.model';

export class BrandService {
    async getAll() {
        return await Brand.findAll();
    }

    async getById(id: number) {
        return await Brand.findByPk(id);
    }

    async create(ddata: { name: string }) {
        return await Brand.create(ddata);
    }

    async update(id: number, data: { name?: string }) {
        const brand = await Brand.findByPk(id);
        if (!brand) return null;
        return await brand.update(data);
    }

    async delete(id: number) {
        const brand = await Brand.findByPk(id);
        if (!brand) return false;
        await brand.destroy();
        return true;
    }
}