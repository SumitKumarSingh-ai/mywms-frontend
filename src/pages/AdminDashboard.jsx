import React from 'react';
import { useAuth } from '../context/AuthContext';
import WarehousePage from './WarehousePage'; // Import our new page

export default function AdminDashboard() {
    const { user, logout } = useAuth();

    return (
        <div className="flex min-h-screen bg-gray-900 text-white">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 p-4 shadow-lg">
                <h1 className="text-2xl font-bold text-blue-400 mb-8">MyWMS Admin</h1>
                <nav>
                    <ul>
                        <li className="mb-4">
                            <a href="#" className="block p-2 rounded bg-blue-600">Warehouse</a>
                        </li>
                        <li className="mb-4">
                            <a href="#" className="block p-2 rounded hover:bg-gray-700">Products</a>
                        </li>
                        <li className="mb-4">
                            <a href="#" className="block p-2 rounded hover:bg-gray-700">Users</a>
                        </li>
                    </ul>
                </nav>
                <div className="mt-auto absolute bottom-4">
                    <p className="text-sm">Logged in as {user?.username}</p>
                    <button onClick={logout} className="mt-2 w-full text-left bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
                <WarehousePage />
            </main>
        </div>
    );
}