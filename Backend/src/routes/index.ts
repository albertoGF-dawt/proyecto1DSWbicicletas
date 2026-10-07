import { Router } from 'express';
import bicycleRoutes from '../modules/bicycles/bicycle.routes';
import brandRoutes from '../modules/brands/brand.routes';
import bicycleDetailRoutes from '../modules/bicycleDetails/bicycleDetail.routes';
import orderRoutes from '../modules/orders/orders.routes';
import customerRoutes from '../modules/customers/customers.routes';

const router = Router();


router.use('/bicycles', bicycleRoutes);


router.use('/brands', brandRoutes);


router.use('/bicycle-details', bicycleDetailRoutes);

router.use('/orders', orderRoutes);

router.use('/customers', customerRoutes);


export default router;