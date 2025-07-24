import api from './api';

export const getGoodsReceipts = async () => {
    return await api.get('/inbound/receipts/');
};

export const uploadGoodsReceipt = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return await api.post('/inbound/receipts/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};