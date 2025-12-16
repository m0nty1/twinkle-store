import React, { useState, useEffect } from 'react';
import { Plus, Trash, Edit, Save, X, Image as ImageIcon } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../services/productService';
import { Product, Category, SubCategory } from '../types';
import { CATEGORIES, SUB_CATEGORIES } from '../constants';

const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    category: 'Perfumes',
    sub_category: 'None',
    images: [],
    isFeatured: false
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await fetchProducts();
    setProducts(data);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    // If storage is mock (undefined), use placeholder
    if (!storage) {
        alert("Demo Mode: Using random placeholder image. In production, this uploads to Firebase Storage.");
        const mockUrl = `https://picsum.photos/seed/${Date.now()}/800/800`;
        setCurrentProduct(prev => ({ ...prev, images: [...(prev.images || []), mockUrl] }));
        return;
    }

    setUploading(true);
    try {
      const file = e.target.files[0];
      const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setCurrentProduct(prev => ({ ...prev, images: [...(prev.images || []), url] }));
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed. Check console.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct.title || !currentProduct.price) return;

    try {
      if (currentProduct.id) {
        await updateProduct(currentProduct.id, currentProduct);
      } else {
        await addProduct(currentProduct as Product);
      }
      setIsEditing(false);
      setCurrentProduct({ category: 'Perfumes', sub_category: 'None', images: [], isFeatured: false });
      loadProducts();
    } catch (error) {
      console.error("Save failed", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
      loadProducts();
    }
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setIsEditing(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl text-gray-900">Admin Dashboard</h1>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-gold-500 text-white px-4 py-2 rounded hover:bg-gold-600 transition-colors"
          >
            <Plus size={18} /> Add Product
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
          <div className="flex justify-between mb-4">
             <h2 className="text-xl font-bold">{currentProduct.id ? 'Edit Product' : 'New Product'}</h2>
             <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-red-500"><X /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input 
                  type="text" 
                  className="w-full border p-2 rounded" 
                  value={currentProduct.title || ''} 
                  onChange={e => setCurrentProduct({...currentProduct, title: e.target.value})}
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price (EGP)</label>
                <input 
                  type="number" 
                  className="w-full border p-2 rounded" 
                  value={currentProduct.price || ''} 
                  onChange={e => setCurrentProduct({...currentProduct, price: Number(e.target.value)})}
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select 
                  className="w-full border p-2 rounded"
                  value={currentProduct.category}
                  onChange={e => setCurrentProduct({...currentProduct, category: e.target.value as Category})}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Sub Category</label>
                <select 
                  className="w-full border p-2 rounded"
                  value={currentProduct.sub_category}
                  onChange={e => setCurrentProduct({...currentProduct, sub_category: e.target.value as SubCategory})}
                >
                  {SUB_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea 
                  className="w-full border p-2 rounded h-24"
                  value={currentProduct.description || ''}
                  onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})}
                  required
                />
              </div>
              <div>
                 <label className="block text-sm font-medium mb-1">Stock</label>
                <input 
                  type="number" 
                  className="w-full border p-2 rounded" 
                  value={currentProduct.stock || 0} 
                  onChange={e => setCurrentProduct({...currentProduct, stock: Number(e.target.value)})}
                />
              </div>
              <div className="flex items-center">
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={currentProduct.isFeatured || false}
                      onChange={e => setCurrentProduct({...currentProduct, isFeatured: e.target.checked})}
                      className="w-4 h-4 text-gold-600 rounded border-gray-300 focus:ring-gold-500"
                    />
                    <span className="text-sm font-medium">Featured Product</span>
                 </label>
              </div>
            </div>

            {/* Image Upload */}
            <div className="border-t pt-4">
              <label className="block text-sm font-medium mb-2">Images</label>
              <div className="flex flex-wrap gap-4 mb-4">
                {currentProduct.images?.map((img, idx) => (
                  <div key={idx} className="relative w-24 h-24 group">
                    <img src={img} alt="Product" className="w-full h-full object-cover rounded border" />
                    <button 
                      type="button"
                      onClick={() => setCurrentProduct(prev => ({...prev, images: prev.images?.filter((_, i) => i !== idx)}))}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:border-gold-500 hover:text-gold-500 transition-colors">
                  <ImageIcon size={24} />
                  <span className="text-xs mt-1">{uploading ? '...' : 'Upload'}</span>
                  <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" disabled={uploading} />
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 flex items-center gap-2"
              >
                <Save size={18} /> Save Product
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Product List */
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map(product => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img className="h-10 w-10 rounded-full object-cover" src={product.images[0]} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.title}</div>
                        {product.isFeatured && <span className="text-xs text-gold-600 font-bold">Featured</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.price} EGP</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEdit(product)} className="text-indigo-600 hover:text-indigo-900 mr-4"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900"><Trash size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;