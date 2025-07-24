import api from './api';

export const getInventoryByLocation = (locationCode) => {
    return api.get(`/correction/location/${locationCode}`);
};

export const updateInventoryItem = (inventoryId, data) => {
    return api.put(`/correction/inventory/${inventoryId}`, data);
};

export const deleteInventoryItem = (inventoryId) => {
    return api.delete(`/correction/inventory/${inventoryId}`);
};