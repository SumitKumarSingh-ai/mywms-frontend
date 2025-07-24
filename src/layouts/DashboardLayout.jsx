import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function DashboardLayout() {
    return (
        <div className="flex h-screen overflow-hidden bg-slate-100">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto">
                    <div className="p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}