import api from './api';

export const getProducts = async () => {
    return await api.get('/inventory/products/');
};

export const createProduct = async (productData) => {
    return await api.post('/inventory/products/', productData);
};

export const updateProduct = async (id, productData) => {
    return await api.put(`/inventory/products/${id}`, productData);
};

export const deleteProduct = async (id) => {
    return await api.delete(`/inventory/products/${id}`);
};