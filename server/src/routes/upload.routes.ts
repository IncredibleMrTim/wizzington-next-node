import { Router } from 'express';
import * as uploadController from '../controllers/upload.controller';
import { upload } from '../middleware/upload.middleware';

const router = Router();

// Get max files from environment or use default
const maxFiles = process.env.MAX_FILES ? parseInt(process.env.MAX_FILES, 10) : 10;

// Single file upload
router.post('/single', upload.single('file'), uploadController.uploadSingle);

// Multiple file upload
router.post('/multiple', upload.array('files', maxFiles), uploadController.uploadMultiple);

export default router;
