import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import User from './models/User.js';
import Task from './models/Task.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await Task.deleteMany();
        await User.deleteMany();

        const users = await User.create([
            {
                name: 'Admin User',
                email: 'admin@aurora.com',
                password: 'password123',
                role: 'team_head',
            },
            {
                name: 'John Doe',
                email: 'john@aurora.com',
                password: 'password123',
                role: 'team_member',
            },
            {
                name: 'Jane Smith',
                email: 'jane@aurora.com',
                password: 'password123',
                role: 'team_member',
            },
            {
                name: 'Mike Johnson',
                email: 'mike@aurora.com',
                password: 'password123',
                role: 'team_member',
            },
        ]);

        const adminUser = users[0];
        const teamMembers = users.slice(1);

        // Add members to admin's team
        adminUser.teamMembers = teamMembers.map(u => u._id);
        await adminUser.save();

        const tasks = [
            {
                user: adminUser._id,
                title: 'Design System Update',
                description: 'Review and update the color palette and typography.',
                status: 'To Do',
                priority: 'high',
                tag: 'Design',
            },
            {
                user: adminUser._id,
                title: 'API Integration',
                description: 'Connect frontend with the new task APIs.',
                status: 'In Progress',
                priority: 'high',
                tag: 'Development',
            },
            {
                user: adminUser._id,
                title: 'Write Documentation',
                description: 'Document the new authentication flow.',
                status: 'Done',
                priority: 'medium',
                tag: 'Docs',
            },
            {
                user: adminUser._id,
                title: 'Team Meeting',
                description: 'Weekly sync with the engineering team.',
                status: 'To Do',
                priority: 'low',
                tag: 'Meeting',
            },
        ];

        await Task.insertMany(tasks);

        console.log('Data Imported!'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Task.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
