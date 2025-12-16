import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../services/productService';
import { Product, Category } from '../types';
import { CATEGORIES } from '../constants';

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const currentCategory = searchParams.get('category') || 'All';

  useEffect(() => {
    const load = async () => {
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (currentCategory === 'All') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === currentCategory));
    }
  }, [currentCategory, products]);

  const handleCategoryChange = (cat: string) => {
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl text-gray-900 mb-4">Shop</h1>
          <p className="text-gray-500">Explore our exclusive collection.</p>
        </div>

        {/* Filters */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1 rounded-full shadow-sm inline-flex">
            <button 
              onClick={() => handleCategoryChange('All')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${currentCategory === 'All' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:text-gold-600'}`}
            >
              All
            </button>
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${currentCategory === cat ? 'bg-gray-900 text-white' : 'text-gray-600 hover:text-gold-600'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
             {[1,2,3,4,5,6].map(i => <div key={i} className="h-96 bg-gray-200 animate-pulse rounded"></div>)}
           </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No products found in this category.</p>
            <button 
              onClick={() => handleCategoryChange('All')} 
              className="mt-4 text-gold-600 hover:underline"
            >
              View all products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;