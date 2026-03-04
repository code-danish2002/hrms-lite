import React from 'react';
import { Menu, Moon, Sun } from 'lucide-react';

export const Navbar = ({ onMenuClick, darkMode, toggleDarkMode }) => {
    return (
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 lg:px-8">
            <div className="flex items-center">
                <button onClick={onMenuClick} className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                    <Menu className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white ml-2">HR Management System</h2>
            </div>
            <div className="flex items-center space-x-4">
                <button
                    onClick={toggleDarkMode}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                    aria-label="Toggle Dark Mode"
                >
                    {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
                </button>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 hidden sm:block">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
            </div>
        </header>
    );
};
