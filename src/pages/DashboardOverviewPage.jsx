import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FiArrowDownCircle, FiArrowUpCircle, FiArchive, FiAlertTriangle } from 'react-icons/fi';

// A reusable card component for our stats
const StatCard = ({ title, value, description, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <div className={`p-3 rounded-full mr-4 ${color.bg}`}>
            <Icon className={`w-6 h-6 ${color.text}`} />
        </div>
        <div>
            <p className="text-sm text-slate-500">{title}</p>
            <p className="text-3xl font-bold text-slate-800">{value}</p>
            <p className="text-xs text-slate-400">{description}</p>
        </div>
    </div>
);

export default function DashboardOverviewPage() {
    const { user } = useAuth();
    
    return (
        <div className='text-slate-800'>
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Welcome back, <span className='text-blue-600'>{user?.username}</span>!</h1>
                <p className="mt-1 text-slate-500">Here's a summary of your warehouse operations today.</p>
            </div>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard 
                    title="Inbound Today"
                    value="12"
                    description="Purchase Orders Received"
                    icon={FiArrowDownCircle}
                    color={{ bg: 'bg-blue-100', text: 'text-blue-600' }}
                />
                <StatCard 
                    title="Outbound Today"
                    value="8"
                    description="Sales Orders Dispatched"
                    icon={FiArrowUpCircle}
                    color={{ bg: 'bg-green-100', text: 'text-green-600' }}
                />
                <StatCard 
                    title="Total Inventory Items"
                    value="1,482"
                    description="Unique SKUs in Stock"
                    icon={FiArchive}
                    color={{ bg: 'bg-amber-100', text: 'text-amber-600' }}
                />
                <StatCard 
                    title="Low Stock Alerts"
                    value="5"
                    description="Items below reorder point"
                    icon={FiAlertTriangle}
                    color={{ bg: 'bg-red-100', text: 'text-red-600' }}
                />
            </div>

            {/* Placeholder for future charts or activity logs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-slate-700 mb-4">Inbound vs. Outbound Trend</h2>
                    <div className="h-64 bg-slate-100 flex items-center justify-center rounded-md">
                        <p className="text-slate-400">Chart will be implemented here</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-slate-700 mb-4">Recent Activity</h2>
                    <ul className="space-y-4">
                        <li className="text-sm text-slate-500">User 'Sumit' created a new product.</li>
                        <li className="text-sm text-slate-500">PO #1234 received.</li>
                        <li className="text-sm text-slate-500">SO #5678 dispatched.</li>
                        <li className="text-sm text-slate-500">Cycle count scheduled for BIN-A01.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}