import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// @desc    Get team members (Owned teams + Teams I am in)
// @route   GET /api/team
// @access  Private
const getTeamMembers = asyncHandler(async (req, res) => {
    // 1. Get the 'Owned' Team (where I am the admin/head)
    const currentUser = await User.findById(req.user._id).populate('teamMembers', 'name email role');

    // 2. Get 'Participating' Teams (where I am a member)
    const participatingTeamsDB = await User.find({ teamMembers: req.user._id })
        .populate('teamMembers', 'name email role')
        .select('name email teamMembers');

    const teams = [];

    // Add Owned Team if it has members or if the user is an admin or team_head
    if (currentUser.role === 'admin' || currentUser.role === 'team_head' || currentUser.teamMembers.length > 0) {
        teams.push({
            id: currentUser._id.toString(),
            name: 'My Team', // Or currentUser.name + "'s Team"
            description: 'Team managed by you',
            members: currentUser.teamMembers.filter(m => m !== null).map(m => ({
                _id: m._id,
                name: m.name,
                email: m.email,
                role: m.role,
                // Mock stats for now until Task model is integrated
                tasksAssigned: 0,
                tasksCompleted: 0
            })),
            isOwner: true
        });
    }

    // Add Participating Teams
    participatingTeamsDB.forEach(boss => {
        teams.push({
            id: boss._id.toString(),
            name: `${boss.name || boss.email}'s Team`,
            description: `Managed by ${boss.name || boss.email}`,
            members: boss.teamMembers.filter(m => m !== null).map(m => ({
                _id: m._id,
                name: m.name,
                email: m.email,
                role: m.role,
                tasksAssigned: 0,
                tasksCompleted: 0
            })),
            isOwner: false
        });
    });

    // If no teams found at all, provide a default empty one for structure if needed, 
    // or just return empty list.
    // The frontend expects at least one team selected usually, so let's handle that there.

    res.json(teams);
});

// @desc    Add team member
// @route   POST /api/team
// @access  Private (Team Head only)
const addTeamMember = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        res.status(400);
        throw new Error('Please provide an email');
    }

    const currentUser = await User.findById(req.user._id);

    // Check if user exists in system
    let userToAdd = await User.findOne({ email });

    // OPTIONAL: If user doesn't exist, maybe create a placeholder or invite?
    // For now, we strictly require registered users.
    if (!userToAdd) {
        res.status(404);
        throw new Error('User not found with that email');
    }

    if (userToAdd._id.equals(req.user._id)) {
        res.status(400);
        throw new Error('You cannot add yourself to your team');
    }

    if (currentUser.teamMembers.includes(userToAdd._id)) {
        res.status(400);
        throw new Error('User already in team');
    }

    currentUser.teamMembers.push(userToAdd._id);
    await currentUser.save();

    // Re-fetch to return the updated list of members for the "Owned" team
    const populatedUser = await User.findById(req.user._id).populate('teamMembers', 'name email role');

    // Map to the format we use in getTeamMembers
    const updatedMembers = populatedUser.teamMembers.map(m => ({
        _id: m._id,
        name: m.name,
        email: m.email,
        role: m.role,
        tasksAssigned: 0,
        tasksCompleted: 0
    }));

    res.status(200).json(updatedMembers);
});

// @desc    Remove team member
// @route   DELETE /api/team/:id
// @access  Private (Team Head only)
const removeTeamMember = asyncHandler(async (req, res) => {
    const memberId = req.params.id;
    const currentUser = await User.findById(req.user._id);

    currentUser.teamMembers = currentUser.teamMembers.filter(
        (id) => id.toString() !== memberId
    );

    await currentUser.save();

    res.status(200).json({ id: memberId });
});

import Activity from '../models/Activity.js';

// ... existing code ...

// @desc    Get team activity
// @route   GET /api/team/activity/:teamId
// @access  Private
const getTeamActivity = asyncHandler(async (req, res) => {
    const { teamId } = req.params;

    // Verify the user is part of this team (either owner or member)
    const teamOwner = await User.findById(teamId);

    if (!teamOwner) {
        res.status(404);
        throw new Error('Team not found');
    }

    const isOwner = teamId.toString() === req.user._id.toString();
    const isMember = teamOwner.teamMembers.includes(req.user._id);

    if (!isOwner && !isMember) {
        res.status(401);
        throw new Error('Not authorized to view this team\'s activity');
    }

    const activities = await Activity.find({ teamOwner: teamId })
        .sort({ createdAt: -1 })
        .limit(20);

    res.json(activities);
});

export { getTeamMembers, addTeamMember, removeTeamMember, getTeamActivity };
