import React from 'react';
import { Users, Calendar, LayoutDashboard, Menu, X } from 'lucide-react';
import { cn } from '../ui';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={cn(
            'flex items-center w-full px-4 py-3 text-sm font-medium transition-colors rounded-lg group',
            active
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
        )}
    >
        <Icon className={cn('w-5 h-5 mr-3', active ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300')} />
        {label}
    </button>
);

export const Sidebar = ({ activeTab, setActiveTab }) => {
    const items = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'employees', label: 'Employees', icon: Users },
        { id: 'attendance', label: 'Attendance', icon: Calendar },
    ];

    return (
        <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 lg:static lg:block hidden">
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-800">
                    <span className="text-xl font-bold text-primary-600 dark:text-primary-400">HRMS Lite</span>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {items.map((item) => (
                        <SidebarItem
                            key={item.id}
                            {...item}
                            active={activeTab === item.id}
                            onClick={() => setActiveTab(item.id)}
                        />
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-700 dark:text-primary-400 font-bold mr-3">
                            A
                        </div>
                        <span>Admin User</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};
