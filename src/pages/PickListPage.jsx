import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import { FiUpload } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { uploadPickList, getPickLists } from '../services/picklistService';

export default function PickListPage() {
    const [picklists, setPicklists] = useState([]);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchPicklists();
    }, []);

    const fetchPicklists = async () => {
        try {
            const response = await getPickLists();
            setPicklists(response.data);
        } catch (error) {
            Swal.fire('Error', 'Could not fetch pick lists.', 'error');
        }
    };

    const handleUploadButtonClick = () => fileInputRef.current.click();

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            await uploadPickList(file);
            Swal.fire('Success', 'Pick List created and allocated successfully!', 'success');
            fetchPicklists();
        } catch (error) {
            Swal.fire('Upload Failed', error.response?.data?.detail || "An error occurred.", 'error');
        } finally {
            event.target.value = null;
        }
    };

    return (
        <div>
            <div className="flex justify-end items-center mb-6">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".xlsx, .xls" />
                <button onClick={handleUploadButtonClick} className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                    <FiUpload className="mr-2" /> Upload Pick List
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-slate-700">Pending Picks</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-100 text-slate-600">
                            <tr>
                                <th className="p-3">OBD Number</th>
                                <th className="p-3">Customer</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Created At</th>
                                <th className="p-3">Items</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {picklists.map(pl => (
                                <tr key={pl.id} className="border-b border-slate-200 hover:bg-slate-50">
                                    <td className="p-3 font-semibold">{pl.obd_number}</td>
                                    <td className="p-3">{pl.customer_name}</td>
                                    <td className="p-3">
                                        <span className='bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full'>
                                            {pl.status}
                                        </span>
                                    </td>
                                    <td className="p-3">{new Date(pl.created_at).toLocaleString()}</td>
                                    <td className="p-3">{pl.items.length}</td>
                                    <td className="p-3 text-center">
                                        <Link to={`/dashboard/picking/${pl.id}`}>
                                            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 text-xs rounded">
                                                Start Picking
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {picklists.length === 0 && (
                        <div className="text-center text-slate-500 p-8">
                            <p>No pick lists are currently pending.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}