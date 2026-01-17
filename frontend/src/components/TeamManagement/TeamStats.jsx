
import React from 'react';
import { Users, TrendingUp, Activity } from 'lucide-react';

const TeamStats = ({ stats, activities }) => {
    const { total, adminCount, memberCount } = stats;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stat Card 1: Total Members */}
            <div className="glass-card p-6 rounded-3xl relative overflow-hidden group border border-white/60 dark:border-gray-700/60 shadow-xl">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                    <Users size={120} />
                </div>
                <div className="flex items-start justify-between relative z-10">
                    <div>
                        <p className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-1">Total Members</p>
                        <h3 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight">{total}</h3>
                        <div className="mt-4 text-xs font-semibold text-gray-400 dark:text-gray-500">
                            Active Members
                        </div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl text-white shadow-lg shadow-indigo-500/30">
                        <Users size={28} />
                    </div>
                </div>
            </div>

            {/* Stat Card 2: Team Performance */}
            <div className="glass-card p-6 rounded-3xl flex items-center justify-between border border-white/60 dark:border-gray-700/60 shadow-xl relative overflow-hidden">
                <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>

                <div className="relative z-10 w-full">
                    <p className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-4">Performance</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/50 dark:bg-gray-700/30 p-3 rounded-2xl">
                            <span className="block text-2xl font-black text-gray-900 dark:text-white">{stats.productivity}%</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Efficiency</span>
                        </div>
                        <div className="bg-white/50 dark:bg-gray-700/30 p-3 rounded-2xl">
                            <span className="block text-2xl font-black text-gray-900 dark:text-white">{stats.completedTasks}/{stats.totalTasks}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Tasks Done</span>
                        </div>
                    </div>
                    <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500" style={{ width: `${stats.productivity}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Stat Card 3: Recent Activity */}
            <div className="glass-card p-6 rounded-3xl border border-white/60 dark:border-gray-700/60 shadow-xl flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <p className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">Recent Activity</p>
                    <Activity size={16} className="text-gray-400 animate-pulse" />
                </div>
                <div className="flex-1 space-y-4 overflow-y-auto pr-2 relative max-h-48 custom-scrollbar">
                    {activities && activities.length > 0 ? (
                        activities.map((act, i) => (
                            <div key={i} className="flex items-start space-x-3 text-sm group">
                                <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 shadow-[0_0_8px] 
                                    ${act.type === 'member_add' ? 'bg-emerald-400 shadow-emerald-400/60' : 'bg-rose-400 shadow-rose-400/60'}`}>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-gray-600 dark:text-gray-400 leading-snug">
                                        <span className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-500 transition-colors cursor-pointer capitalize">
                                            {/* Dynamic Activity Icon or Type?? */}
                                        </span> {act.text}
                                    </p>
                                    <span className="text-[10px] text-gray-400 font-medium">
                                        {new Date(act.createdAt).toLocaleDateString()} at {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
                            <Activity size={32} className="text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                No recent activity.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeamStats;
