import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/productService';

const BRANDS = ["Mamaearth", "B-Blunt", "TDC", "Aqualogica", "Ayuga", "Staze", "Pure Origin"];

const InputField = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-semibold text-slate-600 mb-1">{label}</label>
        <input {...props} className="w-full p-2 rounded bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
);

export default function ProductManagementPage() {
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({
        ean: '', material_code: '', name: '', brand: BRANDS[0],
        mrp: '', case_size: 1, min_qty: 0, max_qty: 0
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchProductsData();
    }, []);

    const fetchProductsData = async () => {
        try {
            const response = await getProducts();
            setProducts(response.data);
        } catch (error) {
            Swal.fire('Error', 'Could not fetch products.', 'error');
        }
    };
    
    const handleInputChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await createProduct(newProduct);
            Swal.fire('Success', 'Product created successfully!', 'success');
            setNewProduct({ ean: '', material_code: '', name: '', brand: BRANDS[0], mrp: '', case_size: 1, min_qty: 0, max_qty: 0 });
            fetchProductsData();
        } catch (error) {
            Swal.fire('Error', error.response?.data?.detail || "Failed to create product.", 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const openEditModal = (product) => {
        setEditingProduct({ ...product });
        setIsModalOpen(true);
    };
    const handleEditChange = (e) => {
        setEditingProduct({ ...editingProduct, [e.target.name]: e.target.value });
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { id, ean, material_code, uom, ...updateData } = editingProduct;
            await updateProduct(id, updateData);
            Swal.fire('Success', 'Product updated successfully!', 'success');
            setIsModalOpen(false);
            setEditingProduct(null);
            fetchProductsData();
        } catch (error) {
            Swal.fire('Error', error.response?.data?.detail || "Failed to update product.", 'error');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDelete = (product) => {
        Swal.fire({
            title: `Delete ${product.name}?`,
            text: "This also deletes all associated inventory records!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteProduct(product.id);
                    Swal.fire('Deleted!', 'The product has been deleted.', 'success');
                    fetchProductsData();
                } catch (error) {
                     Swal.fire('Error', error.response?.data?.detail || "Failed to delete product.", 'error');
                }
            }
        });
    };

    return (
        <div className="text-slate-800">
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-slate-700">Create New Product</h2>
                <form onSubmit={handleCreateSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <InputField label="EAN No." type="text" name="ean" value={newProduct.ean} onChange={handleInputChange} required />
                    <InputField label="Material Code" type="text" name="material_code" value={newProduct.material_code} onChange={handleInputChange} required />
                    <div className="col-span-1 md:col-span-2"><InputField label="Product Name" type="text" name="name" value={newProduct.name} onChange={handleInputChange} required /></div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">Brand</label>
                        <select name="brand" value={newProduct.brand} onChange={handleInputChange} className="w-full p-2 rounded bg-slate-50 border border-slate-300 h-10">
                            {BRANDS.map(b=><option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>
                    <InputField label="MRP" type="number" step="0.01" name="mrp" value={newProduct.mrp} onChange={handleInputChange} required />
                    <InputField label="Case Size" type="number" name="case_size" value={newProduct.case_size} onChange={handleInputChange} required />
                    <div className="flex items-end"><button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full h-10">{isLoading ? 'Creating...' : 'Create Product'}</button></div>
                </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                 <h2 className="text-2xl font-semibold mb-4 text-slate-700">Product Master</h2>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-100 text-slate-600">
                            <tr>
                                <th className="p-3">EAN / Material Code</th>
                                <th className="p-3">Name</th>
                                <th className="p-3">Brand</th>
                                <th className="p-3">MRP</th>
                                <th className="p-3">Case Size</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(prod => (
                                <tr key={prod.id} className="border-b border-slate-200 hover:bg-slate-50">
                                    <td className="p-3 font-mono"><div className="font-semibold">{prod.ean}</div><div className="text-xs text-slate-500">{prod.material_code}</div></td>
                                    <td className="p-3 font-semibold">{prod.name}</td>
                                    <td className="p-3">{prod.brand}</td>
                                    <td className="p-3">{prod.mrp}</td>
                                    <td className="p-3">{prod.case_size}</td>
                                    <td className="p-3 text-center">
                                        <button onClick={() => openEditModal(prod)} className="text-blue-500 hover:text-blue-700 p-1 mr-2"><FiEdit size={18} /></button>
                                        <button onClick={() => handleDelete(prod)} className="text-red-500 hover:text-red-700 p-1"><FiTrash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl">
                        <h2 className="text-2xl font-bold mb-6">Edit Product: {editingProduct.name}</h2>
                        <form onSubmit={handleUpdateSubmit}>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField label="Product Name" type="text" name="name" value={editingProduct.name} onChange={handleEditChange} required />
                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 mb-1">Brand</label>
                                    <select name="brand" value={editingProduct.brand} onChange={handleEditChange} className="w-full p-2 rounded bg-slate-100 border border-slate-300 h-10">
                                        {BRANDS.map(b=><option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                                <InputField label="MRP" type="number" step="0.01" name="mrp" value={editingProduct.mrp} onChange={handleEditChange} required />
                                <InputField label="Case Size" type="number" name="case_size" value={editingProduct.case_size} onChange={handleEditChange} required />
                                <InputField label="Min Qty" type="number" name="min_qty" value={editingProduct.min_qty} onChange={handleEditChange} required />
                                <InputField label="Max Qty" type="number" name="max_qty" value={editingProduct.max_qty} onChange={handleEditChange} required />
                            </div>
                            <div className="flex justify-end gap-4 mt-8">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">Cancel</button>
                                <button type="submit" disabled={isLoading} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}