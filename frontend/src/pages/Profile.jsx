import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Smartphone, Key, Bell, CreditCard, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 animate-fade-in py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header Profile Card */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                    <div className="w-24 h-24 bg-gradient-to-br from-aurora-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-white dark:ring-gray-800">
                        {getInitials(user?.name)}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{user?.name}</h1>
                        <div className="flex flex-col md:flex-row items-center gap-4 text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-2 text-sm bg-gray-100 dark:bg-gray-700/50 px-3 py-1 rounded-full">
                                <Mail size={14} /> {user?.email}
                            </span>
                            <span className="flex items-center gap-2 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full capitalize border border-blue-100 dark:border-blue-800">
                                <Shield size={14} /> {user?.role || 'Member'} Role
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center gap-2"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>

                {/* Account Settings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Access & Security */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <Key size={20} className="text-aurora-500" /> Security & Access
                        </h3>
                        <div className="space-y-4">
                            <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg text-gray-400">
                                        <Key size={18} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-gray-900 dark:text-white text-sm">Change Password</p>
                                        <p className="text-xs text-gray-500">Update your security key</p>
                                    </div>
                                </div>
                                <span className="text-xs text-aurora-600 font-bold group-hover:underline">Update</span>
                            </button>
                            <div className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg text-gray-400">
                                        <Smartphone size={18} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-gray-900 dark:text-white text-sm">Two-Factor Auth</p>
                                        <p className="text-xs text-gray-500">Add an extra layer of security</p>
                                    </div>
                                </div>
                                <span className="text-xs text-green-600 font-bold bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">Enabled</span>
                            </div>
                        </div>
                    </div>

                    {/* Preferences */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <User size={20} className="text-purple-500" /> Preferences
                        </h3>
                        <div className="space-y-4">
                            <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg text-gray-400">
                                        <Bell size={18} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-gray-900 dark:text-white text-sm">Notifications</p>
                                        <p className="text-xs text-gray-500">Manage email & push alerts</p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-500 font-bold">Manage</span>
                            </button>
                            <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg text-gray-400">
                                        <CreditCard size={18} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-gray-900 dark:text-white text-sm">Billing</p>
                                        <p className="text-xs text-gray-500">Plans & payment methods</p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-500 font-bold">View</span>
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;
