import React from 'react';
import { ShoppingCart, Star, Eye } from 'lucide-react';
import { useProducts } from '../hooks/useSupabaseData';
import { formatKES } from '../lib/supabase';

const ShopPreview: React.FC = () => {
  const { products, loading, error } = useProducts();

  if (loading) {
    return (
      <section id="shop" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading products...</p>
        </div>
      </section>
    );
  }

  if (error || products.length === 0) {
    return (
      <section id="shop" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Our Fun Shop
          </h2>
          <p className="text-white/90">Products coming soon!</p>
        </div>
      </section>
    );
  }

  // Show featured products or first 4 products
  const displayProducts = products.filter(product => product.featured).slice(0, 4);

  return (
    <section id="shop" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Our Fun Shop
          </h2>
          <div className="w-24 h-1 bg-star-yellow mx-auto rounded-full"></div>
          <p className="text-xl text-white mt-4 opacity-90 max-w-2xl mx-auto">
            Discover our premium collection of bouncy castles, slides, and fun accessories!
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-3xl group"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden h-48">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3 bg-royal-blue text-white px-3 py-1 rounded-full text-xs font-bold">
                  {product.category}
                </div>

                {/* Stock Status */}
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold ${
                  product.in_stock ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {product.in_stock ? 'In Stock' : 'Out of Stock'}
                </div>

                {/* View Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-white/90 hover:bg-white text-royal-blue p-2 rounded-full shadow-lg transition-colors duration-300">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Product Content */}
              <div className="p-6">
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-royal-blue mb-2 group-hover:text-bright-orange transition-colors duration-300">
                    {product.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < product.rating
                            ? 'text-star-yellow fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">({product.rating}.0)</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-royal-blue">
                      {formatKES(product.price_kes)}
                    </span>
                    <span className="text-sm text-gray-600 ml-1">/day</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button className="flex-1 bg-gradient-to-r from-royal-blue to-blue-600 text-white font-bold py-3 px-4 rounded-full hover:from-blue-600 hover:to-royal-blue transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </button>
                  <button 
                    className={`font-bold py-3 px-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                      product.in_stock
                        ? 'bg-gradient-to-r from-bright-orange to-fun-pink text-white hover:from-fun-pink hover:to-bright-orange'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={!product.in_stock}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <a
            href="/shop"
            className="inline-block bg-gradient-to-r from-star-yellow to-bright-orange text-royal-blue font-bold text-xl px-12 py-4 rounded-full hover:from-bright-orange hover:to-star-yellow transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl"
          >
            View All Products
          </a>
        </div>
      </div>
    </section>
  );
};

export default ShopPreview;