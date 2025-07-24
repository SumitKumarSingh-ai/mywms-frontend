import React from 'react';
import { useAuth } from '../context/AuthContext';

function DashboardPage() {
    const { logout } = useAuth();
    return (
        <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center text-white">
            <h1 className="text-5xl font-bold mb-8">Welcome to MyWMS!</h1>
            <p className="text-xl mb-8">Dashboard content will go here.</p>
            <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                Logout
            </button>
        </div>
    );
}
export default DashboardPage;