import React from 'react';
import { Link } from 'react-router-dom';
import { FaWarehouse, FaUsers, FaMapMarkedAlt } from 'react-icons/fa';
import { FiPackage } from 'react-icons/fi';

const AdminCard = ({ to, icon: Icon, title, description, color }) => (
    <Link to={to} className={`group bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col border-t-4 ${color}`}>
        <Icon className={`text-4xl mb-4 ${color.replace('border-', 'text-')}`} />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
        <p className="text-slate-500 mb-4 flex-grow">{description}</p>
        <div className="mt-auto text-blue-600 font-semibold flex items-center">
            Go to {title}
            <span className="ml-2 transition-transform group-hover:translate-x-1">&rarr;</span>
        </div>
    </Link>
);

export default function AdminPage() {
    return (
        <div className='min-h-full'>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <AdminCard 
                    to="/dashboard/warehouses"
                    icon={FaWarehouse}
                    title="Warehouses"
                    description="Create new warehouses and manage existing company sites."
                    color="border-teal-500"
                />
                <AdminCard 
                    to="/dashboard/users"
                    icon={FaUsers}
                    title="Users"
                    description="Manage user accounts, roles, and warehouse assignments."
                    color="border-indigo-500"
                />
                <AdminCard 
                    to="/dashboard/products"
                    icon={FiPackage}
                    title="Products"
                    description="Manage product master data, SKUs, and descriptions."
                    color="border-amber-500"
                />
                <AdminCard 
                    to="/dashboard/locations"
                    icon={FaMapMarkedAlt}
                    title="Locations"
                    description="Define specific storage bins, shelves, and zones within a warehouse."
                    color="border-blue-500"
                />
            </div>
        </div>
    );
}