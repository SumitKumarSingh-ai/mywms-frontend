import api from './api';

export const uploadPickList = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/outbound/picklists/upload/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const getPickLists = () => {
    return api.get('/outbound/picklists/');
};

export const getPickListDetails = (id) => {
    return api.get(`/outbound/picklists/${id}`);
};

export const confirmPick = (itemId) => {
    return api.post(`/outbound/picking/execute-item/${itemId}`);
};

export const forceClosePickItem = (itemId) => {
    return api.post(`/outbound/picking/force-close-item/${itemId}`);
};
