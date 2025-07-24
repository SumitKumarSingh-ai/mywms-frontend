import api from './api';

export const getLocations = async () => {
    return await api.get('/inventory/locations/');
};

export const createLocation = async (locationData) => {
    return await api.post('/inventory/locations/', locationData);
};

export const updateLocation = async (id, locationData) => {
    return await api.put(`/inventory/locations/${id}`, locationData);
};

export const deleteLocation = async (id) => {
    return await api.delete(`/inventory/locations/${id}`);
};