import api from './api';

export const getUsers = async () => {
    return await api.get('/admin/users/');
};

export const createUser = async (userData) => {
    return await api.post('/auth/register/', userData);
};

export const updateUser = async (id, userData) => {
    return await api.put(`/admin/users/${id}`, userData);
};

export const deleteUser = async (id) => {
    return await api.delete(`/admin/users/${id}`);
};