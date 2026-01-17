import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { Users, Clock, Zap, Video, Plus, Calendar, ArrowRight } from 'lucide-react';
import { APP_FEATURES } from '../constants';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const fetchDashboardData = async () => {
        const headers = { 'Authorization': `Bearer ${user.token}` };

        // Fetch Teams
        const teamRes = await fetch('/api/team', { headers });
        const teams = await teamRes.json();

        if (!teamRes.ok) throw new Error('Failed to fetch teams');

        let dashboardData = { teamMembers: [], activities: [] };

        if (teams.length > 0) {
            const primaryTeam = teams[0];
            dashboardData.teamMembers = primaryTeam.members || [];

            // Fetch Activities
            const activityRes = await fetch(`/api/team/activity/${primaryTeam.id}`, { headers });
            const activityData = await activityRes.json();

            if (activityRes.ok) {
                dashboardData.activities = activityData;
            }
        }
        return dashboardData;
    };

    const { data: dashboardData, isLoading } = useQuery({
        queryKey: ['dashboardData'],
        queryFn: fetchDashboardData,
        staleTime: 60000 // Cache for 1 minute
    });

    const activities = dashboardData?.activities || [];
    const teamMembers = dashboardData?.teamMembers || [];
    const loading = isLoading;

    // Use centralized features configuration
    const features = APP_FEATURES;

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 animate-fade-in pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Welcome Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                            <Calendar size={14} className="mr-2" /> {today}
                        </p>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                            Welcome back, <span className="bg-gradient-to-r from-aurora-600 to-purple-600 bg-clip-text text-transparent">{user.name.split(' ')[0]}</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/kanban', { state: { openNewTask: true } })}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                        >
                            <Plus size={16} /> New Task
                        </button>
                        <button
                            onClick={() => navigate('/video-call')}
                            className="flex items-center gap-2 px-5 py-2.5 bg-aurora-600 text-white rounded-xl text-sm font-medium hover:bg-aurora-700 transition-colors shadow-lg shadow-aurora-500/20"
                        >
                            <Video size={16} /> New Meeting
                        </button>
                    </div>
                </div>

                {/* Apps Grid */}
                <div className="mb-12">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                        <Zap size={20} className="mr-2 text-aurora-500" /> Quick Access
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div key={index} onClick={() => navigate(feature.path)} className="cursor-pointer group">
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-xl hover:-translate-y-1 hover:border-aurora-500/50">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.iconBg} flex items-center justify-center text-white mb-4 shadow-lg`}>
                                        <feature.icon size={22} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{feature.description}</p>
                                    <div className="flex items-center text-aurora-600 dark:text-aurora-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                                        {feature.stats} <ArrowRight size={14} className="ml-1" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity / Overview Split */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Activity Feed */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
                            <button className="text-sm text-aurora-600 hover:text-aurora-700 font-medium">View All</button>
                        </div>
                        {activities.length > 0 ? (
                            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                                <div className="space-y-4">
                                    {activities.map((activity, index) => (
                                        <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                                            <div className="mt-1 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                                <Users size={14} />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-900 dark:text-white">
                                                    <span className="font-bold">Team Admin</span> {activity.text}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">{new Date(activity.createdAt).toLocaleDateString()} • {new Date(activity.createdAt).toLocaleTimeString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm min-h-[300px] flex items-center justify-center text-center">
                                <div className="space-y-3">
                                    <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                        <Clock size={24} className="text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-gray-900 dark:text-white font-medium">All caught up!</p>
                                        <p className="text-sm text-gray-500">No new notifications.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Team Snapshot */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Team</h2>
                        <div className="bg-gradient-to-br from-aurora-600 to-purple-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl">
                                        <Users size={24} />
                                    </div>
                                    <span className="text-xs font-bold bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg uppercase tracking-wider">Active</span>
                                </div>
                                <h3 className="text-3xl font-bold mb-1">{user.role === 'admin' ? 'Admin Access' : 'Member'}</h3>
                                <p className="text-aurora-100 text-sm mb-6">Manage your workspace collaboration.</p>

                                {user.role === 'admin' && (
                                    <button onClick={() => navigate('/team-management')} className="w-full py-3 bg-white text-aurora-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors shadow-lg">
                                        Manage Team
                                    </button>
                                )}
                                {user.role !== 'admin' && (
                                    <div className="flex -space-x-3 mt-2">
                                        {teamMembers.length > 0 ? teamMembers.slice(0, 5).map(m => (
                                            <div key={m._id} className="w-10 h-10 rounded-full border-2 border-white/50 bg-white/20 backdrop-blur-md flex items-center justify-center text-xs font-bold" title={m.name}>
                                                {m.name.charAt(0)}
                                            </div>
                                        )) : (
                                            <p className="text-sm opacity-80">No team members</p>
                                        )}
                                        {teamMembers.length > 5 && (
                                            <div className="w-10 h-10 rounded-full border-2 border-white/50 bg-white/20 backdrop-blur-md flex items-center justify-center text-xs font-bold">
                                                +{teamMembers.length - 5}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            {/* Decor */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
