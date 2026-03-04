import React, { useEffect, useState } from 'react';
import { Users, UserCheck, UserX, BarChart3, TrendingUp } from 'lucide-react';
import { Card, cn } from '../components/ui';
import { dashboardService } from '../api';

const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
    <Card className="p-6">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <h3 className="text-2xl font-bold mt-1 text-gray-900">{value}</h3>
                {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
            </div>
            <div className={cn('p-3 rounded-lg', color)}>
                <Icon className="w-6 h-6 text-white" />
            </div>
        </div>
    </Card>
);

export default function Dashboard({ setActiveTab, navigateToEmployees }) {
    const [stats, setStats] = useState({ total_employees: 0, present_today: 0, absent_today: 0 });
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchStats(selectedDate);
    }, [selectedDate]);

    const fetchStats = (date) => {
        setLoading(true);
        dashboardService.getSummary(date)
            .then(res => setStats(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        {selectedDate === new Date().toISOString().split('T')[0]
                            ? "Welcome back, Admin. Here's what's happening today."
                            : `Viewing statistics for ${selectedDate}`
                        }
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500 outline-none dark:text-white transition-all"
                    />
                    <div className="hidden sm:flex items-center space-x-1 text-sm font-medium text-green-600 dark:text-emerald-400 bg-green-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full">
                        <TrendingUp className="w-4 h-4" />
                        <span>Active Session</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Employees"
                    value={stats.total_employees}
                    icon={Users}
                    color="bg-blue-600 dark:bg-blue-700"
                    subtext="Registered in system"
                />
                <StatCard
                    title={selectedDate === new Date().toISOString().split('T')[0] ? "Present Today" : "Present on Date"}
                    value={stats.present_today}
                    icon={UserCheck}
                    color="bg-emerald-600 dark:bg-emerald-700"
                    subtext="Marked as active"
                />
                <StatCard
                    title={selectedDate === new Date().toISOString().split('T')[0] ? "Absent Today" : "Absent on Date"}
                    value={stats.absent_today}
                    icon={UserX}
                    color="bg-red-600 dark:bg-red-700"
                    subtext="Not in office"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h3>
                        <BarChart3 className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-500 dark:text-gray-400 italic">No recent activity for this date.</p>
                        </div>
                    )}
                </Card>

                <Card className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => navigateToEmployees(true)}
                            className="p-4 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors text-sm font-medium"
                        >
                            Add Employee
                        </button>
                        <button
                            onClick={() => setActiveTab('attendance')}
                            className="p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors text-sm font-medium"
                        >
                            Mark Attendance
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
