import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function SalesDashboard() {
    const { user, logout } = useAuth();
    return (
        <div className="bg-blue-800 text-white min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold">Sales Panel</h1>
            <p className="mt-4 text-xl">Welcome, {user?.username}!</p>
             <p className="text-blue-200">Your role is: {user?.role}</p>
            <button onClick={logout} className="mt-8 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Logout
            </button>
        </div>
    );
}