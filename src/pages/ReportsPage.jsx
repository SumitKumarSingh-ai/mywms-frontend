import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { getCurrentStockReport, getPicklistSummaryReport, getPickingReport, getPutawayReport, getInwardReport } from '../services/reportService';
import { FiDownload, FiRefreshCw } from 'react-icons/fi';
import { formatDate, calculateShelfLife } from '../utils/dateUtils';

const TABS = {
    INVENTORY: 'Inventory Summary',
    INWARD: 'Inward Report',
    PUTAWAY: 'Putaway Report',
    PICKLIST: 'Picklist Report',
    PICKING: 'Picking Report',
};

const ShelfLifeBadge = ({ percentage }) => {
    let bgColor = 'bg-green-100'; let textColor = 'text-green-800'; let barColor = 'bg-green-500';
    if (percentage < 75) { bgColor = 'bg-yellow-100'; textColor = 'text-yellow-800'; barColor = 'bg-yellow-500'; }
    if (percentage < 50) { bgColor = 'bg-red-100'; textColor = 'text-red-800'; barColor = 'bg-red-500'; }
    return (
        <div className={`relative w-20 h-6 rounded-full ${bgColor}`}>
            <div className={`h-full rounded-full ${barColor}`} style={{ width: `${percentage}%` }}></div>
            <span className={`absolute inset-0 flex items-center justify-center text-xs font-semibold ${textColor}`}>{percentage}%</span>
        </div>
    );
};

export default function ReportsPage() {
    const [activeTab, setActiveTab] = useState(TABS.INVENTORY);
    const [reportData, setReportData] = useState({
        [TABS.INVENTORY]: [], [TABS.INWARD]: [], [TABS.PUTAWAY]: [], [TABS.PICKLIST]: [], [TABS.PICKING]: [],
    });
    const [isLoading, setIsLoading] = useState(true);

    const fetchReports = async () => {
        setIsLoading(true);
        try {
            const [stockRes, picklistRes, pickingRes, putawayRes, inwardRes] = await Promise.allSettled([
                getCurrentStockReport(), getPicklistSummaryReport(), getPickingReport(), getPutawayReport(), getInwardReport()
            ]);
            
            setReportData({
                [TABS.INVENTORY]: stockRes.status === 'fulfilled' ? stockRes.value.data.sort((a, b) => a['EAN No.'].localeCompare(b['EAN No.'])) : [],
                [TABS.PICKLIST]: picklistRes.status === 'fulfilled' ? picklistRes.value.data : [],
                [TABS.PICKING]: pickingRes.status === 'fulfilled' ? pickingRes.value.data : [],
                [TABS.PUTAWAY]: putawayRes.status === 'fulfilled' ? putawayRes.value.data : [],
                [TABS.INWARD]: inwardRes.status === 'fulfilled' ? inwardRes.value.data : [],
            });
        } catch (error) {
            Swal.fire('Error', 'Could not fetch report data.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchReports(); }, []);
    
    const handleDownload = () => {
        const data = reportData[activeTab];
        const fileName = activeTab.toLowerCase().replace(/ /g, '_');
        if (data.length === 0) {
            Swal.fire('No Data', 'There is no data to download for this report.', 'info');
            return;
        }
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
        XLSX.writeFile(workbook, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const renderActiveTable = () => {
        const data = reportData[activeTab];
        if (isLoading) return <p className="text-center p-8">Loading Report...</p>;
        if (data.length === 0) return <p className="text-center p-8">No data available for this report.</p>;

        switch (activeTab) {
            case TABS.INVENTORY:
                return (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-100 text-slate-600 sticky top-0">
                            <tr>
                                <th className="p-3">PRODUCT DETAILS</th>
                                <th className="p-3">LOCATION</th>
                                <th className="p-3">BATCH</th>
                                <th className="p-3">MFG DATE</th>
                                <th className="p-3">SHELF LIFE %</th>
                                <th className="p-3">ON HAND</th>
                                <th className="p-3">RESERVED</th>
                                <th className="p-3">AVAILABLE</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {data.map((item, index) => (
                                <tr key={index} className="hover:bg-slate-50">
                                    <td className="p-3"><p className="font-bold">{item['EAN No.']}</p><p className="text-slate-600">{item['Material']}</p><p className="text-slate-500 text-xs">{item['Description']}</p></td>
                                    <td className="p-3 font-mono">{item['Location']}</td>
                                    <td className="p-3">{item['Batch'] || 'N/A'}</td>
                                    <td className="p-3">{formatDate(item['MFG Date'])}</td>
                                    <td className="p-3"><ShelfLifeBadge percentage={item['Shelf Life %']} /></td>
                                    <td className="p-3 text-center">{item['Qty']}</td>
                                    <td className="p-3 text-center">{item['Reserved Qty']}</td>
                                    <td className="p-3 text-center font-bold">{item['Qty'] - item['Reserved Qty']}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            case TABS.INWARD:
                return (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-100 text-slate-600 sticky top-0">
                            <tr>
                                <th className="p-3">REFERENCE DETAILS</th>
                                <th className="p-3">PRODUCT DETAILS</th>
                                <th className="p-3">QUANTITY</th>
                                <th className="p-3">BATCH</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {data.map((item, index) => (
                                <tr key={index} className="hover:bg-slate-50">
                                    <td className="p-3"><p className="font-bold">{item['Reference No.']}</p></td>
                                    <td className="p-3"><p className="font-bold">{item['EAN No.']}</p><p className="text-slate-600">{item['Material']}</p><p className="text-slate-500 text-xs">{item['Description']}</p></td>
                                    <td className="p-3"><p>Received: {item['Qty']}</p><p className="font-bold">Open: {item['Open Qty']}</p></td>
                                    <td className="p-3">{item['Batch']}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            case TABS.PUTAWAY:
                return (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-100 text-slate-600 sticky top-0">
                            <tr>
                                <th className="p-3">RECEIPT DETAILS</th>
                                <th className="p-3">PRODUCT DETAILS</th>
                                <th className="p-3">PUTAWAY DETAILS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {data.map((item, index) => (
                                <tr key={index} className="hover:bg-slate-50">
                                    <td className="p-3"><p className="font-bold">GRN-{item['grn_id']}</p><p className="text-slate-500 text-xs">PO: {item['po_number']}</p></td>
                                    <td className="p-3"><p className="font-bold">{item['product_ean']}</p><p className="text-slate-500 text-xs">{item['product_name']}</p></td>
                                    <td className="p-3"><p>Qty: <span className="font-semibold">{item['putaway_quantity']}</span></p><p className="text-slate-500 text-xs">Batch: {item['batch']}</p></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            case TABS.PICKLIST:
                return (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-100 text-slate-600 sticky top-0">
                            <tr>
                                <th className="p-3">ORDER DETAILS</th>
                                <th className="p-3">PRODUCT DETAILS</th>
                                <th className="p-3">QUANTITY</th>
                                <th className="p-3">ALLOCATION DETAILS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {data.map((item, index) => (
                                <tr key={index} className="hover:bg-slate-50">
                                    <td className="p-3"><p className="font-bold">{item['OBD No.']}</p><p className="text-slate-500 text-xs">{item['Customer Name']}</p></td>
                                    <td className="p-3"><p className="font-bold">{item['EAN No.']}</p><p className="text-slate-500 text-xs">{item['Description']}</p></td>
                                    <td className="p-3"><p>Asked: <span className="font-semibold">{item['Asked Qty']}</span></p><p>Allocated: <span className="font-bold">{item['Allocated Qty']}</span></p></td>
                                    <td className="p-3"><p className="font-mono">{item['Location']}</p><p className="text-slate-500 text-xs">Batch: {item['Batch']}</p></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            case TABS.PICKING:
                return (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-100 text-slate-600 sticky top-0">
                            <tr>
                                <th className="p-3">ORDER DETAILS</th>
                                <th className="p-3">PRODUCT DETAILS</th>
                                <th className="p-3">PICK DETAILS</th>
                                <th className="p-3">SHELF LIFE</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {data.map((item, index) => (
                                <tr key={index} className="hover:bg-slate-50">
                                    <td className="p-3"><p className="font-bold">{item['OBD No.']}</p><p className="text-slate-500 text-xs">{item['Customer Name']}</p></td>
                                    <td className="p-3"><p className="font-bold">{item['EAN No.']}</p><p className="text-slate-500 text-xs">{item['Description']}</p></td>
                                    <td className="p-3"><p>Picked Qty: <span className="font-bold">{item['Qty']}</span></p><p className="font-mono text-xs">From: {item['Location']}</p><p className="text-slate-500 text-xs">Batch: {item['Batch']}</p></td>
                                    <td className="p-3"><p>MFG: {formatDate(item['mfg_date'])}</p><ShelfLifeBadge percentage={calculateShelfLife(item['mfg_date'], item['exp_date'])} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            default: return null;
        }
    };

    return (
        <div className="text-slate-800 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-slate-700">Reports</h1>
                <div className="flex items-center space-x-4">
                    <button onClick={fetchReports} className="text-slate-500 hover:text-blue-600 flex items-center text-sm font-medium"><FiRefreshCw className="mr-2"/> Refresh Data</button>
                    <button onClick={handleDownload} className="flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"><FiDownload className="mr-2" /> Download Excel</button>
                </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md">
                <div className="border-b border-slate-200">
                    <nav className="-mb-px flex space-x-6 px-6 overflow-x-auto">
                        {Object.values(TABS).map(tabName => (
                            <button key={tabName} onClick={() => setActiveTab(tabName)}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${ activeTab === tabName ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300' }`}>
                                {tabName}
                            </button>
                        ))}
                    </nav>
                </div>
                {renderActiveTable()}
            </div>
        </div>
    );
}