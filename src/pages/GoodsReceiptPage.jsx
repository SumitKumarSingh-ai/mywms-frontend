import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import { FiUpload } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { uploadGoodsReceipt, getGoodsReceipts } from '../services/goodsReceiptService';

export default function GoodsReceiptPage() {
    const [receipts, setReceipts] = useState([]);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchReceipts();
    }, []);

    const fetchReceipts = async () => {
        try {
            const response = await getGoodsReceipts();
            setReceipts(response.data);
        } catch (error) {
            Swal.fire('Error', 'Could not fetch goods receipts.', 'error');
        }
    };

    const handleUploadButtonClick = () => fileInputRef.current.click();

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            await uploadGoodsReceipt(file);
            Swal.fire('Success', 'Goods Receipt created successfully!', 'success');
            fetchReceipts(); // Refresh the list after successful upload
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
                <button onClick={handleUploadButtonClick} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                    <FiUpload className="mr-2" /> Upload Goods Receipt
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-slate-700">Pending Putaway</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-100 text-slate-600">
                            <tr>
                                {/* REMOVED GRN ID Header */}
                                <th className="p-3">PO Number</th>
                                <th className="p-3">Supplier</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Received At</th>
                                <th className="p-3">Items</th>
                                {/* ADDED Actions Header */}
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {receipts.map(grn => (
                                <tr key={grn.id} className="border-b border-slate-200 hover:bg-slate-50">
                                    {/* REMOVED GRN ID Cell */}
                                    <td className="p-3 font-semibold">{grn.po_number}</td>
                                    <td className="p-3">{grn.supplier_name}</td>
                                    <td className="p-3">
                                        <span className='bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full'>
                                            {grn.status}
                                        </span>
                                    </td>
                                    <td className="p-3">{new Date(grn.created_at).toLocaleString()}</td>
                                    <td className="p-3">{grn.items.length}</td>
                                    {/* ADDED Actions Cell */}
                                    <td className="p-3 text-center">
                                        <Link to={`/dashboard/goods-receipt/${grn.id}/putaway`}>
                                            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 text-xs rounded">
                                                Start Putaway
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {receipts.length === 0 && (
                        <div className="text-center text-slate-500 p-8">
                            <p>No goods receipts are currently awaiting putaway.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}