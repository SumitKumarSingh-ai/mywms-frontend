import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../services/api';
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const calculateShelfLife = (mfgDateStr, expiryInMonths) => {
    if (!mfgDateStr || !expiryInMonths) return { expDate: '', shelfLifePercentage: 0 };
    const mfgDate = new Date(mfgDateStr);
    const expDate = new Date(mfgDate.setMonth(mfgDate.getMonth() + parseInt(expiryInMonths, 10)));
    const today = new Date();
    const totalShelfLifeDays = (expDate - new Date(mfgDateStr)) / (1000 * 60 * 60 * 24);
    const remainingShelfLifeDays = (expDate - today) / (1000 * 60 * 60 * 24);
    if (totalShelfLifeDays <= 0) return { expDate: expDate.toISOString().split('T')[0], shelfLifePercentage: 0 };
    const shelfLifePercentage = Math.round((remainingShelfLifeDays / totalShelfLifeDays) * 100);
    return {
        expDate: expDate.toISOString().split('T')[0],
        shelfLifePercentage: Math.max(0, shelfLifePercentage)
    };
};

export default function PutawayExecutionPage() {
    const { user } = useAuth();
    const [goodsReceipt, setGoodsReceipt] = useState(null);
    const [putawayItems, setPutawayItems] = useState([]);
    const [locations, setLocations] = useState([]);
    const { grnId } = useParams();

    const fetchGRNDetails = async () => {
        try {
            const grnRes = await api.get(`/inbound/receipts/${grnId}`);
            setGoodsReceipt(grnRes.data);

            const initialItems = grnRes.data.items.map(item => {
                const remainingQty = item.quantity - item.putaway_quantity;
                return {
                    receipt_item_id: item.id,
                    product_id: item.product.id,
                    total_quantity: item.quantity,
                    putaway_quantity: item.putaway_quantity,
                    remaining_quantity: remainingQty,
                    quantity_to_putaway: remainingQty, // Editable field
                    status: item.status,
                    mfgDate: '',
                    expiryInMonths: '',
                    expDate: '',
                    shelfLifePercentage: 0,
                    batch: item.batch || '',
                    location: '',
                    location_id: null
                }
            });
            setPutawayItems(initialItems);

            const locationsRes = await api.get('/inventory/locations/');
            setLocations(locationsRes.data);
            
        } catch (error) {
            Swal.fire('Error', 'Could not fetch data for putaway.', 'error');
        }
    };

    useEffect(() => {
        if (user) {
            fetchGRNDetails();
        }
    }, [grnId, user]);

    const handleItemChange = (index, field, value) => {
        const newItems = [...putawayItems];
        let currentItem = { ...newItems[index] };
        currentItem[field] = value;

        if (field === 'quantity_to_putaway') {
            const numValue = Number(value);
            if (numValue > currentItem.remaining_quantity) {
                Swal.fire({
                    toast: true, position: 'top-end', icon: 'warning',
                    title: `Max quantity is ${currentItem.remaining_quantity}`,
                    showConfirmButton: false, timer: 2000
                });
                currentItem.quantity_to_putaway = currentItem.remaining_quantity;
            } else {
                currentItem.quantity_to_putaway = numValue;
            }
        }

        if (field === 'mfgDate' || field === 'expiryInMonths') {
            const { expDate, shelfLifePercentage } = calculateShelfLife(currentItem.mfgDate, currentItem.expiryInMonths);
            currentItem.expDate = expDate;
            currentItem.shelfLifePercentage = shelfLifePercentage;
        }
        
        if (field === 'location') {
            const foundLocation = locations.find(loc => loc.code.toLowerCase() === value.toLowerCase());
            currentItem.location_id = foundLocation ? foundLocation.id : null;
        }

        newItems[index] = currentItem;
        setPutawayItems(newItems);
    };

    const handleConfirmItem = async (index) => {
        const item = putawayItems[index];

        if (!item.mfgDate || !item.expiryInMonths || !item.location_id || item.quantity_to_putaway <= 0) {
            Swal.fire('Validation Error', 'Please fill all fields (MFG, Expiry, Location) and ensure Qty is greater than 0.', 'warning');
            return;
        }

        const payload = {
            receipt_item_id: item.receipt_item_id,
            product_id: item.product_id,
            putaway_location_id: item.location_id,
            quantity: item.quantity_to_putaway, // Send the amount being put away now
            batch: item.batch,
            mfg_date: item.mfgDate,
            exp_date: item.expDate
        };

        try {
            await api.post('/inbound/putaway/execute-item/', payload);
            Swal.fire({
                toast: true, position: 'top-end', icon: 'success',
                title: 'Item Put Away!', showConfirmButton: false, timer: 2000
            });
            fetchGRNDetails(); // Refresh data to show updated status
        } catch (error) {
            Swal.fire('Error', error.response?.data?.detail || 'Failed to confirm putaway for this item.', 'error');
        }
    };

    if (!goodsReceipt) return <div className="p-8 text-center">Loading Putaway Task...</div>;

    const pendingItems = putawayItems.filter(item => item.status === 'Pending');

    return (
        <div className="text-slate-800">
            <Link to="/dashboard/goods-receipt" className="flex items-center text-blue-600 hover:underline mb-6 font-semibold">
                <FiArrowLeft className="mr-2" /> Back to Goods Receipts
            </Link>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <div className="grid grid-cols-3 gap-4 text-sm">
                    <div><span className="font-semibold">GRN ID:</span> GRN-{goodsReceipt.id}</div>
                    <div><span className="font-semibold">PO Number:</span> {goodsReceipt.po_number}</div>
                    <div><span className="font-semibold">Supplier:</span> {goodsReceipt.supplier_name}</div>
                </div>
            </div>
            
            <div className="space-y-4">
                {pendingItems.length > 0 ? (
                    pendingItems.map((item) => {
                        const originalIndex = putawayItems.findIndex(p => p.receipt_item_id === item.receipt_item_id);
                        return (
                            <div key={item.receipt_item_id} className="bg-white p-4 rounded-lg shadow-md">
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                                    <div className="md:col-span-2">
                                        <p className="font-bold text-slate-800">{goodsReceipt.items[originalIndex].product.name}</p>
                                        <p className="text-xs text-slate-500">EAN: {goodsReceipt.items[originalIndex].product.ean}</p>
                                        <p className="text-xs text-slate-500">Received: {item.total_quantity} | Remaining: {item.remaining_quantity}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Qty to Put Away</label>
                                        <input type="number" value={item.quantity_to_putaway} onChange={e => handleItemChange(originalIndex, 'quantity_to_putaway', e.target.value)} className="w-full p-2 rounded bg-white border border-slate-300"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Batch</label>
                                        <input type="text" value={item.batch} onChange={e => handleItemChange(originalIndex, 'batch', e.target.value)} placeholder="Enter Batch" className="w-full p-2 rounded bg-white border border-slate-300"/>
                                    </div>
                                    <div className="md:col-span-1">
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Location</label>
                                        <input type="text" value={item.location} onChange={e => handleItemChange(originalIndex, 'location', e.target.value)} required placeholder="Scan/Enter Location" className={`w-full p-2 rounded bg-white border ${item.location && !item.location_id ? 'border-red-500' : 'border-slate-300'}`}/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">MFG Date</label>
                                        <input type="date" value={item.mfgDate} onChange={e => handleItemChange(originalIndex, 'mfgDate', e.target.value)} required className="w-full p-2 rounded bg-white border border-slate-300"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Expiry (Months)</label>
                                        <input type="number" value={item.expiryInMonths} onChange={e => handleItemChange(originalIndex, 'expiryInMonths', e.target.value)} required placeholder="e.g., 12" className="w-full p-2 rounded bg-white border border-slate-300"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">EXP Date</label>
                                        <input type="date" value={item.expDate} disabled className="w-full p-2 rounded bg-slate-200 border-slate-300"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Shelf Life %</label>
                                        <input type="text" value={`${item.shelfLifePercentage}%`} disabled className="w-full p-2 rounded bg-slate-200 border-slate-300 text-center font-bold"/>
                                    </div>
                                    <div className="text-right">
                                        <button type="button" onClick={() => handleConfirmItem(originalIndex)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">Confirm</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="bg-white p-8 rounded-lg shadow-md text-center">
                        <FiCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-slate-700">Putaway Complete!</h2>
                        <p className="text-slate-500 mt-2">All items for this Goods Receipt have been put away.</p>
                    </div>
                )}
            </div>
        </div>
    );
}