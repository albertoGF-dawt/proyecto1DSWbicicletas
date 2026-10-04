import { Router } from 'express';
import bicycleRoutes from '../modules/bicycles/bicycle.routes';
import brandRoutes from '../modules/brands/brand.routes';
import bicycleDetailRoutes from '../modules/bicycleDetails/bicycleDetail.routes';

const router = Router();


router.use('/bicycles', bicycleRoutes);


router.use('/brands', brandRoutes);


router.use('/bicycle-details', bicycleDetailRoutes);


export default router;