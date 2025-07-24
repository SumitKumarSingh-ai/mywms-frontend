export const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

export const calculateShelfLife = (mfgDateStr, expDateStr) => {
    if (!mfgDateStr || !expDateStr) return 0;
    const mfgDate = new Date(mfgDateStr);
    const expDate = new Date(expDateStr);
    const today = new Date();
    if (today > expDate) return 0;
    const totalShelfLifeDays = (expDate - mfgDate) / (1000 * 60 * 60 * 24);
    const remainingShelfLifeDays = (expDate - today) / (1000 * 60 * 60 * 24);
    if (totalShelfLifeDays <= 0) return 0;
    const shelfLifePercentage = Math.round((remainingShelfLifeDays / totalShelfLifeDays) * 100);
    return Math.max(0, shelfLifePercentage);
};