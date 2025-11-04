import { Router } from 'express';
import * as orderController from '../controllers/order.controller';

const router = Router();

router.get('/', orderController.getAll);
router.get('/:id', orderController.getById);
router.post('/', orderController.create);
router.put('/:id', orderController.update);
router.delete('/:id', orderController.remove);

export default router;
