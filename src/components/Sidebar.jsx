import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdDashboard, MdLogout } from 'react-icons/md';
import { HiOutlineShoppingCart } from 'react-icons/hi';
import { FiSettings, FiDownload } from 'react-icons/fi';
import { FaBoxes, FaWrench } from 'react-icons/fa'; // Corrected: Combined imports
import { BsBoxArrowUp } from 'react-icons/bs';

const SidebarItem = ({ item }) => {
    const location = useLocation();
    
    if (item.isHeading) {
        return (
            <div className="px-4 pt-6 pb-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{item.name}</p>
            </div>
        );
    }

    const { name, icon: Icon, route, color } = item;
    const isActive = location.pathname === route || (route !== '/dashboard' && location.pathname.startsWith(route));

    return (
        <Link
            to={route}
            className={`flex items-center px-4 py-2.5 mx-2 my-1 rounded-lg text-base font-medium transition-all duration-200 ease-in-out group ${
                isActive
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
        >
            <Icon className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors ${isActive ? 'text-white' : color}`} />
            <span className="flex-1">{name}</span>
        </Link>
    );
};

export default function Sidebar() {
    const { user, logout } = useAuth();

    const sidebarNavItems = [
        { name: 'Dashboard', icon: MdDashboard, route: '/dashboard', color: 'text-sky-500' },
        { name: 'INWARD', isHeading: true },
        { name: 'Goods Receipt', icon: FaBoxes, route: '/dashboard/goods-receipt', color: 'text-blue-500' },
        { name: 'OUTWARD', isHeading: true },
        { name: 'Sales Orders', icon: HiOutlineShoppingCart, route: '#', color: 'text-rose-500' },
        { name: 'Picking', icon: BsBoxArrowUp, route: '/dashboard/picking', color: 'text-cyan-500' },
        { name: 'REPORTING', isHeading: true },
        { name: 'Reports', icon: FiDownload, route: '/dashboard/reports', color: 'text-green-500' },
    ];
    
    if (user?.role === 'admin') {
        sidebarNavItems.push({ name: 'ADMIN', isHeading: true });
        sidebarNavItems.push({ name: 'Admin Panel', icon: FiSettings, route: '/dashboard/admin', color: 'text-slate-500' });
        sidebarNavItems.push({ name: 'Correction', icon: FaWrench, route: '/dashboard/correction', color: 'text-orange-500' });
    }

    return (
        <aside className="w-56 bg-white border-r border-slate-200 flex flex-col">
            <div className="flex items-center justify-start px-4 h-16 border-b border-slate-200 flex-shrink-0">
                <img src="/header.png" alt="WMS Logo" className="h-9 w-auto" />
            </div>
            
            <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar-hide">
                {sidebarNavItems.map((item) => (
                    <SidebarItem key={item.name} item={item} />
                ))}
            </nav>
            
            <div className="p-4 border-t border-slate-200">
                <button
                    onClick={logout}
                    className="w-full group flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-red-500 hover:bg-red-600 text-white"
                >
                    <MdLogout className="w-5 h-5 mr-2" />
                    Logout
                </button>
            </div>
        </aside>
    );
};