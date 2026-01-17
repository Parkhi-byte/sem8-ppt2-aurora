import express from 'express';
import { getDocuments, uploadDocument, deleteDocument } from '../controllers/documentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getDocuments)
    .post(uploadDocument);

router.route('/:id')
    .delete(deleteDocument);

export default router;
