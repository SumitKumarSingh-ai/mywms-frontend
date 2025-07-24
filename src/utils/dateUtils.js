export const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    // Use toLocaleDateString for simple, local-aware formatting
    return new Date(dateStr).toLocaleDateString('en-IN');
};

export const calculateShelfLife = (mfgDateStr, expDateStr) => {
    if (!mfgDateStr || !expDateStr) return 0;
    
    // Uses the browser's local time, which is what we want now
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