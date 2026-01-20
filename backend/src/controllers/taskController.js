import asyncHandler from 'express-async-handler';
import Task from '../models/Task.js';
import Team from '../models/Team.js'; // Added import

// @desc    Get tasks (Visible to everyone in the team)
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
    // Find teams where user is owner or member
    const teams = await Team.find({
        $or: [
            { owner: req.user.id },
            { members: req.user.id }
        ]
    });

    const teamIds = teams.map(t => t._id);

    // Fetch tasks belonging to these teams
    // Also fetch legacy tasks created by this user (for backward compatibility)
    const tasks = await Task.find({
        $or: [
            { team: { $in: teamIds } },
            { user: req.user.id } // Legacy support
        ]
    })
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 });

    res.status(200).json(tasks);
});

// @desc    Set task (Admin/Head only)
// @route   POST /api/tasks
// @access  Private
const setTask = asyncHandler(async (req, res) => {
    if (!req.body.title) {
        res.status(400);
        throw new Error('Please add a title field');
    }

    // Restrict creation to Team Head or Admin
    if (req.user.role === 'team_member') {
        res.status(403);
        throw new Error('Only Team Heads can create tasks');
    }

    // Find the team this user manages (Assuming single team for now, or use first one)
    // Ideally we should pass teamId from frontend, but we'll default to the first owned team
    const team = await Team.findOne({ owner: req.user.id });

    if (!team) {
        res.status(404);
        throw new Error('You need to create a Team first');
    }

    const task = await Task.create({
        title: req.body.title,
        description: req.body.description,
        status: req.body.status || 'To Do',
        priority: req.body.priority || 'medium',
        tag: req.body.tag || 'General',
        user: req.user.id, // Creator
        team: team._id,
        assignedTo: req.body.assignedTo || null // ObjectId of member
    });

    // Populate assignedTo for immediate frontend update
    const populatedTask = await Task.findById(task._id).populate('assignedTo', 'name email');

    res.status(200).json(populatedTask);
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(400);
        throw new Error('Task not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Permission Logic
    const isCreator = task.user.toString() === req.user.id;
    const isAssigned = task.assignedTo && task.assignedTo.toString() === req.user.id;
    const isHead = req.user.role === 'team_head' || req.user.role === 'admin';

    // 1. Team Head/Admin: Can update ANYTHING
    if (isHead || isCreator) {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        }).populate('assignedTo', 'name email');
        return res.status(200).json(updatedTask);
    }

    // 2. Member: Can ONLY update if assigned to them
    if (req.user.role === 'team_member') {
        if (!isAssigned) {
            res.status(403);
            throw new Error('You can only update tasks assigned to you');
        }

        // Optional: Restrict Member to only status updates?
        // User said "members complete only their assigned tasks". 
        // We'll allow full update for simplicity, or just status if needed.
        // Let's assume updating status is the main goal, but editing description is nice too.

        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        }).populate('assignedTo', 'name email');
        return res.status(200).json(updatedTask);
    }

    // Default Deny
    res.status(403);
    throw new Error('Not authorized to update this task');
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(400);
        throw new Error('Task not found');
    }

    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Only Creator (Head) or Admin can delete
    const isCreator = task.user.toString() === req.user.id;
    const isHead = req.user.role === 'team_head' || req.user.role === 'admin';

    if (!isCreator && !isHead) {
        res.status(403);
        throw new Error('Only Team Heads can delete tasks');
    }

    await task.deleteOne();

    res.status(200).json({ id: req.params.id });
});

export { getTasks, setTask, updateTask, deleteTask };
