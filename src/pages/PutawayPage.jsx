import React, { useRef } from 'react';
import Swal from 'sweetalert2';
import api from '../services/api';
import { FiUpload } from 'react-icons/fi';

export default function PutawayPage() {
    const fileInputRef = useRef(null);

    const handleUploadButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            await api.post('/inbound/putaway/upload/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            Swal.fire('Success', 'Putaway Task created successfully from Excel file!', 'success');
            // Here you would typically refresh a list of putaway tasks
        } catch (error) {
            Swal.fire('Upload Failed', error.response?.data?.detail || "An error occurred.", 'error');
        } finally {
            event.target.value = null; // Reset file input
        }
    };

    return (
        <div className="text-slate-800">
            <div className="flex justify-between items-center mb-6">
                <div></div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".xlsx, .xls" />
                <button onClick={handleUploadButtonClick} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                    <FiUpload className="mr-2" /> Upload Goods Receipt Excel
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-slate-700">Pending Putaway Tasks</h2>
                <div className="text-center text-slate-500 p-8">
                    <p>Pending tasks will be displayed here.</p>
                </div>
            </div>
        </div>
    );
}