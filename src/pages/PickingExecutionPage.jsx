import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FiArrowLeft, FiMapPin, FiBox, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import { getPickListDetails, confirmPick, forceClosePickItem } from '../services/picklistService';
import { calculateShelfLife } from '../utils/dateUtils';
import { useAuth } from '../context/AuthContext';

export default function PickingExecutionPage() {
    const [picklist, setPicklist] = useState(null);
    const { picklistId } = useParams();
    const { user } = useAuth(); // Get the current user
    const userRolesForAdminActions = ['admin', 'manager', 'supervisor'];

    const fetchData = async () => {
        try {
            const res = await getPickListDetails(picklistId);
            setPicklist(res.data);
        } catch (error) {
            Swal.fire('Error', 'Could not fetch Pick List details.', 'error');
        }
    };

    useEffect(() => {
        fetchData();
    }, [picklistId]);

    const handleConfirmPick = async (itemId) => {
        try {
            await confirmPick(itemId);
            Swal.fire({
                toast: true, position: 'top-end', icon: 'success',
                title: 'Pick Confirmed!', showConfirmButton: false, timer: 1500
            });
            fetchData();
        } catch (error) {
            Swal.fire('Error', error.response?.data?.detail || 'Failed to confirm pick.', 'error');
        }
    };
    
    const handleForceClose = async (itemId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This will manually close this unfulfillable item.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, force close it!'
        });

        if (result.isConfirmed) {
            try {
                await forceClosePickItem(itemId);
                Swal.fire('Closed!', 'The item has been manually closed.', 'success');
                fetchData();
            } catch (error) {
                Swal.fire('Error', error.response?.data?.detail || 'Failed to close item.', 'error');
            }
        }
    };

    const sortedItems = useMemo(() => {
        if (!picklist) return [];
        return [...picklist.items].sort((a, b) => {
            if (!a.location) return 1;
            if (!b.location) return -1;
            return a.location.code.localeCompare(b.location.code);
        });
    }, [picklist]);

    if (!picklist) return <div className="p-8 text-center">Loading Picking Task...</div>;
    
    const pendingItems = sortedItems.filter(item => item.status === 'Pending');

    return (
        <div className="text-slate-800">
            {/* ... (Header and Pick List Details sections are the same) ... */}
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-slate-700">Items to Pick</h2>
                <div className="space-y-4">
                    {pendingItems.length > 0 ? (
                        pendingItems.map((item) => (
                            <div key={item.id} className={`grid grid-cols-1 md:grid-cols-5 gap-4 items-center p-3 border rounded-md ${!item.location ? 'border-amber-400 bg-amber-50' : ''}`}>
                                <div className="md:col-span-2">
                                    <p className="font-bold text-slate-800">{item.product.name}</p>
                                    <p className="text-xs text-slate-500">EAN: {item.product.ean}</p>
                                    <p className="text-xs text-slate-500">Batch: {item.batch || 'N/A'}</p>
                                </div>
                                <div className="flex items-center">
                                    {item.location ? <FiMapPin className="mr-2 text-rose-500" /> : <FiAlertTriangle className="mr-2 text-amber-500" />}
                                    <div>
                                        <label className="block text-xs text-slate-500">From Location</label>
                                        <p className="font-mono font-semibold">
                                            {item.location ? item.location.code : <span className="text-amber-600">{item.notes || 'N/A'}</span>}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <FiBox className="mr-2 text-blue-500" />
                                    <div>
                                        <label className="block text-xs text-slate-500">Pick Qty</label>
                                        <p className="font-semibold text-lg">{item.allocated_quantity}</p>
                                    </div>
                                </div>
                                <div className="text-xs text-slate-600">
                                    <p>MFG: {item.mfg_date ? new Date(item.mfg_date).toLocaleDateString() : 'N/A'}</p>
                                    <p>Shelf Life: <span className="font-semibold">{calculateShelfLife(item.mfg_date, item.exp_date)}%</span></p>
                                </div>
                                <div className="text-center">
                                    {item.location ? (
                                        <button onClick={() => handleConfirmPick(item.id)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                                            Confirm Pick
                                        </button>
                                    ) : (
                                        // --- THIS IS THE NEW CONDITIONAL BUTTON ---
                                        userRolesForAdminActions.includes(user?.role) ? (
                                            <button onClick={() => handleForceClose(item.id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded text-xs">
                                                Force Close
                                            </button>
                                        ) : (
                                            <span className="text-amber-600 font-semibold text-sm">Cannot Pick</span>
                                        )
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white p-8 rounded-lg text-center">
                            <FiCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
                            <h2 className="text-2xl font-semibold text-slate-700">Picking Complete!</h2>
                            <p className="text-slate-500 mt-2">All items for this order have been picked or resolved.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}