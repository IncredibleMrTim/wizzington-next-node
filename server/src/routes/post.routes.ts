import { Router } from 'express';
import * as postController from '../controllers/post.controller';

const router = Router();

router.get('/', postController.getAll);
router.get('/:id', postController.getById);
router.post('/', postController.create);
router.put('/:id', postController.update);
router.delete('/:id', postController.remove);

export default router;
