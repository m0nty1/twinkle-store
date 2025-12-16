import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MessageCircle, ArrowLeft, Truck, Shield } from 'lucide-react';
import { fetchProductById } from '../services/productService';
import { Product } from '../types';
import { WHATSAPP_NUMBER, CURRENCY } from '../constants';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const p = await fetchProductById(id);
      setProduct(p);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!product) return <div className="h-screen flex items-center justify-center">Product not found</div>;

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hello Twinkle, I am interested in buying ${product.title} priced at ${product.price} ${CURRENCY}.`
  )}`;

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/shop" className="inline-flex items-center text-gray-500 hover:text-gold-600 mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
              <img 
                src={product.images[selectedImage]} 
                alt={product.title} 
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-gold-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="mb-2 text-gold-600 uppercase tracking-widest text-sm font-bold">
              {product.category} {product.sub_category !== 'None' && `• ${product.sub_category}`}
            </div>
            <h1 className="font-serif text-4xl text-gray-900 mb-4">{product.title}</h1>
            <p className="text-2xl font-bold text-gray-900 mb-8">
              {product.price.toLocaleString()} <span className="text-base font-normal text-gray-500">{CURRENCY}</span>
            </p>

            <div className="prose prose-sm text-gray-600 mb-8">
              <p>{product.description}</p>
            </div>

            <div className="mt-auto space-y-6">
              <a 
                href={whatsappUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-4 rounded-lg text-lg font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <MessageCircle size={24} />
                Order via WhatsApp
              </a>
              
              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-100">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Truck size={20} className="text-gold-500" />
                  <span>Fast delivery across Egypt</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Shield size={20} className="text-gold-500" />
                  <span>Quality Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;