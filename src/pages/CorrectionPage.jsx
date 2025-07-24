import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { getInventoryByLocation, updateInventoryItem, deleteInventoryItem } from '../services/correctionService';
import { FiSearch, FiEdit, FiTrash2, FiSave, FiXCircle } from 'react-icons/fi';

const EditableInventoryRow = ({ item, onSave, onCancel }) => {
    const [editData, setEditData] = useState({
        quantity: item.quantity,
        batch: item.batch || '',
        mfg_date: item.mfg_date || '',
        exp_date: item.exp_date || '',
    });

    const handleChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    return (
        <tr className="bg-blue-50">
            <td className="p-3">
                <p className="font-bold">{item.product.ean}</p>
                <p className="text-slate-500 text-xs">{item.product.name}</p>
            </td>
            <td className="p-2"><input type="number" name="quantity" value={editData.quantity} onChange={handleChange} className="w-20 p-1 border rounded"/></td>
            <td className="p-2"><input type="text" name="batch" value={editData.batch} onChange={handleChange} className="w-32 p-1 border rounded"/></td>
            <td className="p-2"><input type="date" name="mfg_date" value={editData.mfg_date} onChange={handleChange} className="w-36 p-1 border rounded"/></td>
            <td className="p-2"><input type="date" name="exp_date" value={editData.exp_date} onChange={handleChange} className="w-36 p-1 border rounded"/></td>
            <td className="p-3 text-center">
                <button onClick={() => onSave(item.id, editData)} className="text-green-500 hover:text-green-700 mr-4"><FiSave /></button>
                <button onClick={onCancel} className="text-gray-500 hover:text-gray-700"><FiXCircle /></button>
            </td>
        </tr>
    );
};

export default function CorrectionPage() {
    const [locationCode, setLocationCode] = useState('');
    const [inventory, setInventory] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async () => {
        if (!locationCode) return;
        setIsLoading(true);
        setInventory([]);
        try {
            const res = await getInventoryByLocation(locationCode);
            setInventory(res.data);
        } catch (error) {
            Swal.fire('Error', error.response?.data?.detail || 'Could not fetch inventory.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (inventoryId) => {
        const result = await Swal.fire({
            title: 'Are you sure?', text: "This will permanently delete this inventory record!", icon: 'warning',
            showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Yes, delete it!'
        });
        if (result.isConfirmed) {
            try {
                await deleteInventoryItem(inventoryId);
                Swal.fire('Deleted!', 'The inventory record has been deleted.', 'success');
                handleSearch(); // Refresh the list
            } catch (error) {
                Swal.fire('Error', error.response?.data?.detail || 'Failed to delete record.', 'error');
            }
        }
    };

    const handleSave = async (inventoryId, data) => {
        // Format empty strings as null for the backend
        const payload = {
            ...data,
            mfg_date: data.mfg_date || null,
            exp_date: data.exp_date || null,
        };
        try {
            await updateInventoryItem(inventoryId, payload);
            Swal.fire('Success!', 'Inventory has been updated.', 'success');
            setEditingId(null);
            handleSearch(); // Refresh the list
        } catch (error) {
            Swal.fire('Error', error.response?.data?.detail || 'Failed to update record.', 'error');
        }
    };

    return (
        <div className="text-slate-800">
            <h1 className="text-2xl font-semibold text-slate-700 mb-6">Inventory Correction</h1>
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <div className="flex items-center space-x-2">
                    <input type="text" value={locationCode} onChange={(e) => setLocationCode(e.target.value.toUpperCase())}
                        placeholder="Scan or Enter Location Code"
                        className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                        <FiSearch className="mr-2" /> Search
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Stock at: <span className="font-mono text-blue-600">{locationCode || '...'}</span></h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-100 text-slate-600">
                            <tr>
                                <th className="p-3">Product Details</th>
                                <th className="p-3">Quantity</th>
                                <th className="p-3">Batch</th>
                                <th className="p-3">MFG Date</th>
                                <th className="p-3">EXP Date</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {inventory.map(item => (
                                editingId === item.id ? (
                                    <EditableInventoryRow key={item.id} item={item} onSave={handleSave} onCancel={() => setEditingId(null)} />
                                ) : (
                                    <tr key={item.id}>
                                        <td className="p-3">
                                            <p className="font-bold">{item.product.ean}</p>
                                            <p className="text-slate-500 text-xs">{item.product.name}</p>
                                        </td>
                                        <td className="p-3">{item.quantity}</td>
                                        <td className="p-3">{item.batch}</td>
                                        <td className="p-3">{item.mfg_date}</td>
                                        <td className="p-3">{item.exp_date}</td>
                                        <td className="p-3 text-center">
                                            <button onClick={() => setEditingId(item.id)} className="text-blue-500 hover:text-blue-700 mr-4"><FiEdit /></button>
                                            <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700"><FiTrash2 /></button>
                                        </td>
                                    </tr>
                                )
                            ))}
                        </tbody>
                    </table>
                    {isLoading && <p className="text-center p-4">Loading...</p>}
                    {!isLoading && inventory.length === 0 && <p className="text-center p-4">No inventory found for this location.</p>}
                </div>
            </div>
        </div>
    );
}