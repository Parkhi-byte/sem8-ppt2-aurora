import express from 'express';
import { getAllAdmins, getTeamDetails } from '../controllers/masterController.js';
import { protect, master } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(master);

router.get('/admins', getAllAdmins);
router.get('/team/:adminId', getTeamDetails);

export default router;
