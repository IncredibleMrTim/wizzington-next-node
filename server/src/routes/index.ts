import { Router } from 'express';
import userRoutes from './user.routes';
import postRoutes from './post.routes';
import uploadRoutes from './upload.routes';
import productRoutes from './product.routes';
import categoryRoutes from './category.routes';
import orderRoutes from './order.routes';

const router = Router();

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/upload', uploadRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);

export default router;
