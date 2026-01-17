import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';

export const useTeamManagement = () => {
    const { user } = useAuth();

    // State management
    const [teams, setTeams] = useState([]);
    const [currentTeamId, setCurrentTeamId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Input States
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteName, setInviteName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [hoveredMember, setHoveredMember] = useState(null);

    // Fetch Teams from Backend
    const fetchTeams = async () => {
        try {
            setLoading(true);
            const token = user?.token || JSON.parse(localStorage.getItem('user'))?.token; // Fallback directly to storage if context is lagging
            console.log('Fetching teams with token:', token ? 'Present' : 'Missing');

            const res = await fetch('/api/team', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();

            if (res.ok) {
                // Determine if data is array (new format) or something else
                // Controller now returns an array of team objects
                let fetchedTeams = Array.isArray(data) ? data : [];

                // If user has no teams, provide a default empty view? 
                // Or if controller ensures at least one?
                if (fetchedTeams.length === 0) {
                    // If purely empty, maybe default to a self-view
                    fetchedTeams = [{
                        id: 'default',
                        name: 'My View',
                        description: 'No teams found',
                        members: [],
                        isOwner: false
                    }];
                }

                setTeams(fetchedTeams);

                // Set current team preference
                // Try to keep selection if valid, else pick first
                if (currentTeamId) {
                    const stillExists = fetchedTeams.find(t => t.id === currentTeamId);
                    if (!stillExists) setCurrentTeamId(fetchedTeams[0].id);
                } else {
                    setCurrentTeamId(fetchedTeams[0]?.id);
                }
            } else {
                setError(data.message || 'Failed to fetch teams');
            }
        } catch (err) {
            console.error(err);
            setError('Network error fetching teams');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchTeams();
        }
    }, [user]);


    // Derived State
    const currentTeam = useMemo(() => teams.find(t => t.id === currentTeamId) || teams[0], [teams, currentTeamId]);
    const teamMembers = currentTeam?.members || [];

    // "Is Owner" defines if the current user can manage THIS specific team
    const isTeamOwner = currentTeam?.isOwner || false;

    // Global "Admin" status might still be useful, or we rely on isTeamOwner
    const isAdmin = user?.role === 'admin';

    // Filters
    const filteredMembers = useMemo(() => {
        return teamMembers.map(m => ({
            ...m,
            // Ensure numeric values for safety, but DO NOT mock random data
            tasksAssigned: m.tasksAssigned || 0,
            tasksCompleted: m.tasksCompleted || 0,
            productivity: m.productivity || 0
        })).filter(member =>
            (member.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (member.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        );
    }, [teamMembers, searchTerm]);

    // Stats
    const stats = useMemo(() => {
        const adminCount = teamMembers.filter(m => m.role === 'admin').length;
        const memberCount = teamMembers.length;
        const totalTasks = filteredMembers.reduce((acc, curr) => acc + curr.tasksAssigned, 0);
        const completedTasks = filteredMembers.reduce((acc, curr) => acc + curr.tasksCompleted, 0);

        // Calculate Average Productivity only if there are members with data
        // For now, if tasksAssigned > 0, we can calculate a simple productivity % (completed/assigned)
        // Or aggregate their 'productivity' field if it exists in future
        let avgProductivity = 0;
        if (totalTasks > 0) {
            avgProductivity = Math.round((completedTasks / totalTasks) * 100);
        }

        return {
            adminCount,
            memberCount,
            total: teamMembers.length,
            totalTasks,
            completedTasks,
            productivity: avgProductivity
        };
    }, [teamMembers, filteredMembers]);


    // Actions
    const handleInvite = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!inviteEmail.trim()) {
            setError('Please enter an email address');
            return;
        }

        if (!isTeamOwner) {
            setError('Only the team owner can invite members.');
            return;
        }

        setLoading(true);

        try {
            const token = user?.token;
            const res = await fetch('/api/team', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email: inviteEmail })
            });
            const data = await res.json();

            if (res.ok) {
                // data is the updated members list
                // Update local state
                setTeams(prev => prev.map(t => {
                    if (t.id === currentTeamId) {
                        return {
                            ...t, members: data.map(m => ({
                                ...m,
                                tasksAssigned: 0,
                                tasksCompleted: 0
                            }))
                        };
                    }
                    return t;
                }));

                setSuccess(`Invited ${inviteEmail} successfully!`);
                setInviteEmail('');
            } else {
                setError(data.message || 'Failed to invite member');
            }
        } catch (err) {
            setError('Network error during invite');
        } finally {
            setLoading(false);
            // Auto clear success
            setTimeout(() => setSuccess(''), 3000);
        }
    };

    const handleRemoveMember = async (memberId) => {
        if (!isTeamOwner) {
            alert("Only the team owner can remove members.");
            return;
        }

        if (window.confirm('Are you sure you want to remove this member?')) {
            try {
                const token = user?.token;
                const res = await fetch(`/api/team/${memberId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    setTeams(prev => prev.map(t => {
                        if (t.id === currentTeamId) {
                            return { ...t, members: t.members.filter(m => m._id !== memberId) };
                        }
                        return t;
                    }));
                    setSuccess('Member removed from team.');
                } else {
                    const data = await res.json();
                    setError(data.message || 'Failed to remove member');
                }
            } catch (err) {
                setError('Network error removing member');
            } finally {
                setTimeout(() => setSuccess(''), 3000);
            }
        }
    };

    // Create Team currently just selects the 'My Team' or does nothing
    // Since backend doesn't support creating arbitrary teams yet (single Owner relationship)
    const createTeam = (teamName) => {
        // Placeholder: Maybe update the User's team name preference in future?
        alert("Creating new teams is not yet supported in this version.");
    };

    return {
        user,
        isAdmin, // Kept for legacy components checking role directly
        isTeamOwner, // New: precise permission
        inviteEmail, setInviteEmail,
        inviteName, setInviteName,
        searchTerm, setSearchTerm,
        error, setError,
        success, setSuccess,
        loading,
        hoveredMember, setHoveredMember,
        teamMembers,
        filteredMembers,
        stats,
        teams,
        currentTeam,
        setCurrentTeamId,
        createTeam,
        handleInvite,
        handleRemoveMember
    };
};
