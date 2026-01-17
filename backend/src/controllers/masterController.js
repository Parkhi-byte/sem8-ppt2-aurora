import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Activity from '../models/Activity.js';

// @desc    Get all admins (team heads) with their stats
// @route   GET /api/master/admins
// @access  Private (Master only)
const getAllAdmins = asyncHandler(async (req, res) => {
    // Find all users who are 'admin' or 'team_head' (excluding master)
    const admins = await User.find({ role: { $in: ['admin', 'team_head'] } })
        .populate('teamMembers', 'name email role')
        .select('-password');

    // For each admin, calculate stats
    const adminsWithStats = await Promise.all(admins.map(async (admin) => {
        // Count activities for this team
        const activityCount = await Activity.countDocuments({ teamOwner: admin._id });

        return {
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            memberCount: admin.teamMembers.length,
            activityCount: activityCount,
            joinedAt: admin.createdAt,
            // Tasks can be aggregated here if Task model exists and has teamOwner/assignedTo fields
            // For now, returning mock/placeholder task stats or aggregate if feasible
            tasksTotal: 0,
            tasksCompleted: 0
        };
    }));

    res.json(adminsWithStats);
});

// @desc    Get details of a specific team (admin + members)
// @route   GET /api/master/team/:adminId
// @access  Private (Master only)
const getTeamDetails = asyncHandler(async (req, res) => {
    const { adminId } = req.params;

    const admin = await User.findById(adminId)
        .populate('teamMembers', 'name email role tasksAssigned tasksCompleted productivity') // assuming fields exist on User or we populate from Task model later
        .select('-password');

    if (!admin) {
        res.status(404);
        throw new Error('Admin not found');
    }

    const activities = await Activity.find({ teamOwner: adminId }).sort({ createdAt: -1 }).limit(20);

    res.json({
        admin: {
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role
        },
        members: admin.teamMembers, // These are the member objects
        activities
    });
});

export { getAllAdmins, getTeamDetails };
