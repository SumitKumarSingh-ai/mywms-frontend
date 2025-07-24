import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getLocations, createLocation, deleteLocation } from '../services/locationService';
import { FiTrash2, FiPlusCircle } from 'react-icons/fi';

const locationTypes = [ "Storage Bin", "Picking Location", "Receiving Dock", "Packing Station", "QC Area", "Damaged Goods Area", "Short Stock Location" ];

export default function LocationManagementPage() {
    const [locations, setLocations] = useState([]);
    const [newLocationCode, setNewLocationCode] = useState('');
    const [newLocationType, setNewLocationType] = useState(locationTypes[0]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        setIsLoading(true);
        try {
            const response = await getLocations();
            setLocations(response.data);
        } catch (error) {
            Swal.fire('Error', 'Could not fetch locations.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await createLocation({ code: newLocationCode, location_type: newLocationType });
            Swal.fire('Success', 'Location created successfully!', 'success');
            setNewLocationCode('');
            fetchLocations();
        } catch (error) {
            Swal.fire('Error', error.response?.data?.detail || 'Failed to create location.', 'error');
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await deleteLocation(id);
                Swal.fire('Deleted!', 'The location has been deleted.', 'success');
                fetchLocations();
            } catch (error) {
                Swal.fire('Error', error.response?.data?.detail || 'Failed to delete location.', 'error');
            }
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Create New Location</h2>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                            <label htmlFor="loc-code" className="block text-sm font-medium text-gray-700">Location Code</label>
                            <input type="text" id="loc-code" value={newLocationCode} onChange={(e) => setNewLocationCode(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required />
                        </div>
                        <div>
                            <label htmlFor="loc-type" className="block text-sm font-medium text-gray-700">Location Type</label>
                            <select id="loc-type" value={newLocationType} onChange={(e) => setNewLocationType(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                {locationTypes.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>
                        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <FiPlusCircle className="mr-2 h-5 w-5" /> Create
                        </button>
                    </form>
                </div>
            </div>
            <div className="md:col-span-2">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Existing Locations</h2>
                    <div className="overflow-y-auto max-h-96">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-100 text-slate-600 sticky top-0">
                                <tr>
                                    <th className="p-3">Code</th>
                                    <th className="p-3">Type</th>
                                    <th className="p-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {locations.map(loc => (
                                    <tr key={loc.id} className="border-b border-slate-200 hover:bg-slate-50">
                                        <td className="p-3 font-semibold">{loc.code}</td>
                                        <td className="p-3">{loc.location_type}</td>
                                        <td className="p-3 text-center">
                                            <button onClick={() => handleDelete(loc.id)} className="text-red-500 hover:text-red-700">
                                                <FiTrash2 />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {isLoading && <p className="text-center p-4">Loading...</p>}
                        {!isLoading && locations.length === 0 && <p className="text-center p-4">No locations found.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}