import React, { useState, useEffect } from 'react';
import API from '../../api/index'; // Your configured Axios instance
import { useAuth } from '../../hooks/useAuth';
import Loader from '../../components/common/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faUsers, faTag, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

// A small, reusable component for the stat cards
const StatCard = ({ title, value, icon, colorClass }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
            <div className={`text-3xl p-3 rounded-full ${colorClass}`}>
                <FontAwesomeIcon icon={icon} />
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
                <p className="text-3xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    );
};

const AdminDashboard = () => {
    const { userInfo } = useAuth(); // Get user info to personalize the welcome message
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await API.get('/api/dashboard/stats');
                setStats(data);
            } catch (err) {
                console.error("Failed to fetch dashboard stats:", err);
                setError("Could not load dashboard data.");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-800">Dashboard</h1>
            <p className="text-gray-600 mb-6">Welcome back, {userInfo?.name || 'Admin'}!</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Recipes"
                    value={stats?.recipes ?? '0'}
                    icon={faBookOpen}
                    colorClass="bg-blue-100 text-blue-500"
                />
                <StatCard
                    title="Total Users"
                    value={stats?.users ?? '0'}
                    icon={faUsers}
                    colorClass="bg-green-100 text-green-500"
                />
                <StatCard
                    title="Categories"
                    value={stats?.categories ?? '0'}
                    icon={faTag}
                    colorClass="bg-yellow-100 text-yellow-500"
                />
                <StatCard
                    title="FAQs"
                    value={stats?.faqs ?? '0'}
                    icon={faQuestionCircle}
                    colorClass="bg-red-100 text-red-500"
                />
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                <p>From here, you can manage all content on the website.</p>
                <p>Use the sidebar to navigate to different sections like Recipes, Categories, and FAQs.</p>
            </div>
        </div>
    );
};

export default AdminDashboard;