import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from '../services/api';
import { FiUserPlus, FiEdit, FiTrash2 } from 'react-icons/fi';

export default function UserManagementPage() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // State related to warehouses has been removed.

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                // Now we only need to fetch users
                const usersRes = await api.get('/admin/users/');
                setUsers(usersRes.data);
            } catch (error) {
                Swal.fire('Error', 'Could not fetch initial page data.', 'error');
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    // Placeholder functions for Create/Update/Delete actions
    const handleCreateUser = () => alert('Create user functionality to be implemented.');
    const handleEditUser = (user) => alert(`Editing user: ${user.username}`);
    const handleDeleteUser = (user) => alert(`Deleting user: ${user.username}`);

    return (
        <div className="text-slate-800">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-slate-700">User Management</h1>
                <button onClick={handleCreateUser} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                    <FiUserPlus className="mr-2" /> Create User
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-100 text-slate-600">
                            <tr>
                                <th className="p-3">Username</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Role</th>
                                <th className="p-3">Status</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="border-b border-slate-200 hover:bg-slate-50">
                                    <td className="p-3 font-semibold">{user.username}</td>
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3 capitalize">{user.role}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {user.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="p-3 text-center">
                                        <button onClick={() => handleEditUser(user)} className="text-blue-500 hover:text-blue-700 mr-4"><FiEdit /></button>
                                        <button onClick={() => handleDeleteUser(user)} className="text-red-500 hover:text-red-700"><FiTrash2 /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {isLoading && <p className="text-center p-4">Loading users...</p>}
                    {!isLoading && users.length === 0 && <p className="text-center p-4">No users found.</p>}
                </div>
            </div>
        </div>
    );
}