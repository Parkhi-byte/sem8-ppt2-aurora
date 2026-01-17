import express from 'express';
import { getTeamMembers, addTeamMember, removeTeamMember, getTeamActivity } from '../controllers/teamController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply protect middleware to all routes
router.use(protect);

router.route('/')
    .get(getTeamMembers)
    .post(admin, addTeamMember); // Only team heads (admin) can add

router.route('/activity/:teamId')
    .get(getTeamActivity);

router.route('/:id')
    .delete(admin, removeTeamMember); // Only team heads can remove

export default router;
