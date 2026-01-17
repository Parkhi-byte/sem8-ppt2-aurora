
import React from 'react';
import { Search, Shield, BadgeCheck, Mail, X, MoreHorizontal } from 'lucide-react';

const TeamList = ({ filteredMembers, teamMembers, searchTerm, setSearchTerm, hoveredMember, setHoveredMember, handleRemoveMember }) => {
    return (
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 rounded-[2rem] shadow-xl overflow-hidden min-h-[600px] flex flex-col">

            {/* Toolbar */}
            <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-700/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Team Directory</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage permissions and remove access.</p>
                </div>

                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Seach by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border-2 border-transparent focus:border-indigo-500/20 rounded-xl text-sm text-gray-900 dark:text-white shadow-sm focus:shadow-md outline-none w-full md:w-72 transition-all duration-300"
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {filteredMembers.length > 0 ? (
                    filteredMembers.map((member, idx) => (
                        <div
                            key={member._id}
                            onMouseEnter={() => setHoveredMember(member._id)}
                            onMouseLeave={() => setHoveredMember(null)}
                            className="group relative bg-white dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 rounded-3xl p-5 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-5">
                                    <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg transform transition-transform group-hover:scale-110 duration-300 ${member.role === 'admin'
                                        ? 'bg-gradient-to-br from-violet-600 to-fuchsia-600'
                                        : 'bg-gradient-to-br from-sky-500 to-blue-600'
                                        }`}>
                                        {member.name?.[0]?.toUpperCase() || member.email[0].toUpperCase()}

                                        {member.role === 'admin' && (
                                            <div className="absolute -bottom-2 -right-2 bg-amber-400 text-amber-900 p-1.5 rounded-xl border-4 border-white dark:border-gray-800 shadow-md transform group-hover:rotate-12 transition-transform" title="Admin">
                                                <Shield size={12} fill="currentColor" />
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">
                                            {member.name || 'Anonymous User'}
                                            {member.role === 'admin' && (
                                                <BadgeCheck size={18} className="text-violet-500" fill="currentColor" />
                                            )}
                                        </h4>
                                        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mt-1 font-medium">
                                            <Mail size={14} className="mr-2 opacity-50" />
                                            {member.email}
                                        </div>
                                    </div>
                                </div>

                                {/* Task Stats Column */}
                                <div className="hidden md:flex flex-col items-center px-4 w-40">
                                    <div className="w-full flex justify-between text-xs font-bold text-gray-500 mb-1">
                                        <span>Tasks</span>
                                        <span>{Math.round((member.tasksCompleted / (member.tasksAssigned || 1)) * 100)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-400 to-indigo-500"
                                            style={{ width: `${Math.min(100, (member.tasksCompleted / (member.tasksAssigned || 1)) * 100)}%` }}
                                        ></div>
                                    </div>
                                    <div className="mt-1 text-xs text-gray-400">
                                        {member.tasksCompleted} / {member.tasksAssigned} completed
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    {/* Status Badge */}
                                    <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${member.role === 'admin'
                                        ? 'bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800'
                                        : 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
                                        }`}>
                                        {member.role === 'admin' ? 'Admin' : 'Member'}
                                    </div>

                                    {/* Actions */}
                                    {handleRemoveMember && (
                                        <div className={`flex items-center space-x-2 transition-all duration-300 ${hoveredMember === member._id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'
                                            }`}>
                                            <button
                                                onClick={() => handleRemoveMember(member._id)}
                                                className="p-3 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white hover:shadow-lg dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white rounded-2xl transition-all duration-300"
                                                title="Remove User"
                                            >
                                                <X size={18} />
                                            </button>
                                            <button className="p-3 bg-gray-50 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 rounded-2xl transition-colors">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                        <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                            <Search size={40} className="text-gray-300 dark:text-gray-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No members found</h3>
                        <p className="text-gray-500 text-sm max-w-xs mx-auto">
                            We couldn't find anyone matching "{searchTerm}".
                        </p>
                    </div>
                )}
            </div>

            {/* List Footer */}
            {filteredMembers.length > 0 && (
                <div className="p-4 bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-700 text-center text-xs text-gray-400 uppercase tracking-widest font-semibold backdrop-blur-sm">
                    Showing {filteredMembers.length} of {teamMembers.length} team members
                </div>
            )}
        </div>
    );
};

export default TeamList;
