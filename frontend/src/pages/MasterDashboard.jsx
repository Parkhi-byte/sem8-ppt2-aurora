import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Users, Activity, ChevronRight, BarChart2, CheckCircle, Clock, Search, Download } from 'lucide-react';
import PageLoader from '../components/PageLoader';

const MasterDashboard = () => {
    const { user } = useAuth();
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAdmin, setSelectedAdmin] = useState(null); // For detailed view
    const [teamDetails, setTeamDetails] = useState(null); // Detailed data of selected admin
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch Overview (List of Admins)
    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const res = await fetch('/api/master/admins', {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                const data = await res.json();
                if (res.ok) {
                    setAdmins(data);
                    // Auto-select first team if available
                    if (data.length > 0) {
                        handleAdminClick(data[0]._id);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch admins", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdmins();
    }, [user.token]);

    // Fetch Specific Team Details
    const handleAdminClick = async (adminId) => {
        // Prevent unnecessary re-fetch
        if (selectedAdmin === adminId && teamDetails) return;

        setDetailsLoading(true);
        setSelectedAdmin(adminId);
        try {
            const res = await fetch(`/api/master/team/${adminId}`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await res.json();
            if (res.ok) setTeamDetails(data);
        } catch (error) {
            console.error("Failed to fetch team details", error);
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleExportCSV = () => {
        if (!teamDetails) return;

        const headers = ['Name', 'Email', 'Role', 'Tasks Assigned', 'Tasks Completed', 'Productivity'];
        const rows = teamDetails.members.map(m => [
            m.name,
            m.email,
            m.role,
            m.tasksAssigned || 0,
            m.tasksCompleted || 0,
            (m.productivity || 0) + '%'
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${teamDetails.admin.name}_team_report.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <PageLoader />;

    // Calculate Global Stats
    const totalAdmins = admins.length;
    const totalUsers = admins.reduce((acc, curr) => acc + curr.memberCount, 0);
    const totalActivities = admins.reduce((acc, curr) => acc + curr.activityCount, 0);

    const filteredAdmins = admins.filter(admin =>
        admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-gray-200/50 dark:border-gray-700/50">
                <div>
                    <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400">Master Control</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">System-wide overview and performance metrics.</p>
                </div>
                <div className="flex items-center space-x-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-xl border border-red-100 dark:border-red-800">
                    <Shield size={20} />
                    <span className="font-bold text-sm">Super Admin Access</span>
                </div>
            </div>

            {/* Global Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-3xl border border-white/60 dark:border-gray-700/60 shadow-lg relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Teams</p>
                        <h3 className="text-4xl font-black text-gray-900 dark:text-white">{totalAdmins}</h3>
                    </div>
                </div>
                <div className="glass-card p-6 rounded-3xl border border-white/60 dark:border-gray-700/60 shadow-lg relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Members</p>
                        <h3 className="text-4xl font-black text-gray-900 dark:text-white">{totalUsers}</h3>
                    </div>
                </div>
                <div className="glass-card p-6 rounded-3xl border border-white/60 dark:border-gray-700/60 shadow-lg relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">System Activity</p>
                        <h3 className="text-4xl font-black text-gray-900 dark:text-white">{totalActivities}</h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Admin List */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Users size={20} />
                            Active Teams
                        </h3>
                        <span className="text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-1 rounded-full">{filteredAdmins.length}</span>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Find team..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                    </div>

                    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm max-h-[600px] overflow-y-auto custom-scrollbar">
                        {filteredAdmins.map(admin => (
                            <button
                                key={admin._id}
                                onClick={() => handleAdminClick(admin._id)}
                                className={`w-full text-left p-4 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-white dark:hover:bg-gray-700 transition-colors flex items-center justify-between group ${selectedAdmin === admin._id ? 'bg-white dark:bg-gray-700 shadow-md border-l-4 border-l-red-500' : 'border-l-4 border-l-transparent'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm transition-all ${selectedAdmin === admin._id ? 'bg-red-500 dark:bg-red-600' : 'bg-gray-700'}`}>
                                        {admin.name[0]}
                                    </div>
                                    <div>
                                        <h4 className={`font-bold text-sm ${selectedAdmin === admin._id ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>{admin.name}</h4>
                                        <p className="text-xs text-gray-500">{admin.memberCount} Members</p>
                                    </div>
                                </div>
                                <ChevronRight size={16} className={`transition-colors ${selectedAdmin === admin._id ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'}`} />
                            </button>
                        ))}
                        {filteredAdmins.length === 0 && (
                            <div className="p-8 text-center text-gray-500 text-sm">No teams found.</div>
                        )}
                    </div>
                </div>

                {/* Right: Detailed View */}
                <div className="lg:col-span-2">
                    {detailsLoading ? (
                        <div className="h-96 flex items-center justify-center bg-white/30 dark:bg-gray-800/30 rounded-3xl animate-pulse">
                            <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                        </div>
                    ) : teamDetails ? (
                        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 dark:border-gray-800 animate-fade-in-up">

                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-2xl font-black text-gray-900 dark:text-white">{teamDetails.admin.name}'s Team</h2>
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-wide">Active</span>
                                    </div>
                                    <p className="text-gray-500">{teamDetails.admin.email}</p>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleExportCSV}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <Download size={16} />
                                        Export Report
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl flex flex-col items-center justify-center text-center">
                                    <span className="text-3xl font-black text-gray-900 dark:text-white">{teamDetails.members.length}</span>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Members</span>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl flex flex-col items-center justify-center text-center">
                                    <span className="text-3xl font-black text-indigo-500">
                                        {teamDetails.members.reduce((acc, m) => acc + (m.tasksCompleted || 0), 0)}
                                    </span>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Tasks Done</span>
                                </div>
                            </div>

                            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">
                                Member Performance
                            </h3>

                            <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                                {teamDetails.members.map(member => (
                                    <div key={member._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                                                {member.name[0]}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-white text-sm">{member.name}</h4>
                                                <p className="text-xs text-gray-500">{member.email}</p>
                                            </div>
                                        </div>

                                        {/* Performance Bar */}
                                        <div className="flex-1 max-w-xs mx-8 hidden sm:block">
                                            <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1">
                                                <span>Productivity</span>
                                                <span className={member.productivity > 80 ? 'text-green-500' : 'text-gray-500'}>{member.productivity || 0}%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${member.productivity > 80 ? 'bg-green-500' : 'bg-indigo-500'}`}
                                                    style={{ width: `${member.productivity || 0}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="px-3 py-1 bg-white dark:bg-gray-900 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 shadow-sm">
                                                {member.tasksCompleted || 0} tasks
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {teamDetails.members.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                                        <Users size={32} className="mb-2 opacity-50" />
                                        <p className="text-sm">No members to display.</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center justify-between">
                                    <span>Recent Logs</span>
                                    <span className="text-[10px] bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-500">Last 20 events</span>
                                </h3>
                                <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
                                    {teamDetails.activities.length > 0 ? teamDetails.activities.map((act, i) => (
                                        <div key={i} className="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-3 pl-2 border-l-2 border-gray-200 dark:border-gray-700">
                                            <span className="font-mono text-[10px] text-gray-400 min-w-fit mt-0.5">
                                                {new Date(act.createdAt).toLocaleDateString()}
                                            </span>
                                            <span className="leading-snug">
                                                <span className="font-bold text-gray-700 dark:text-gray-300">Admin</span> {act.text}
                                            </span>
                                        </div>
                                    )) : (
                                        <p className="text-gray-400 text-xs italic text-center py-4">No activity logs recorded yet.</p>
                                    )}
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div className="h-96 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/30 rounded-[2.5rem] border border-dashed border-gray-300 dark:border-gray-700 text-center p-8">
                            <BarChart2 size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Select a Team</h3>
                            <p className="text-gray-500 max-w-xs mx-auto">Click on a team from the list to view their detailed performance statistics.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MasterDashboard;
