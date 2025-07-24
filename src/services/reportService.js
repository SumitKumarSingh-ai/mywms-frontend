import api from './api';

export const getCurrentStockReport = () => {
    return api.get('/reports/current-stock/');
};

export const getPicklistSummaryReport = () => {
    return api.get('/reports/picklist-summary/');
};

export const getPickingReport = () => {
    return api.get('/reports/picking-report/');
};

export const getPutawayReport = () => {
    return api.get('/reports/putaway-report/');
};

// --- ADD THIS NEW FUNCTION ---
export const getInwardReport = () => {
    return api.get('/reports/inward-report/');
};