import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser } from 'react-icons/fi';

export default function Header() {
    const { user } = useAuth();
    const location = useLocation();
    const [title, setTitle] = useState('Dashboard');

    useEffect(() => {
        const path = location.pathname;
        switch (path) {
            case '/dashboard':
                setTitle('Dashboard Overview');
                break;
            case '/dashboard/admin':
                setTitle('Admin Control Panel');
                break;
            case '/dashboard/warehouses':
                setTitle('Warehouse Management');
                break;
            case '/dashboard/products':
                setTitle('Product Management');
                break;
            case '/dashboard/users':
                setTitle('User Management');
                break;
            case '/dashboard/locations':
                setTitle('Location Management');
                break;
            case '/dashboard/goods-receipt':
                setTitle('Goods Receipt');
                break;
            default:
                if (path.startsWith('/dashboard/purchase-orders/')) {
                    setTitle('Purchase Order Details');
                } else {
                    setTitle('Dashboard');
                }
        }
    }, [location]);

    return (
        <header className="bg-white shadow-sm px-4 h-16 flex justify-between items-center flex-shrink-0">
            <div>
                <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
            </div>
            <div className="flex items-center">
                <div className="text-right mr-4">
                    <p className="font-semibold text-slate-800 text-sm">{user?.username}</p>
                    <p className="text-xs text-slate-500 capitalize">{user?.role} Role</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    <FiUser size={20} />
                </div>
            </div>
        </header>
    );
}