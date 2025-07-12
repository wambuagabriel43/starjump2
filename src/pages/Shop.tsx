import React, { useState } from 'react';
import { ShoppingCart, Star, Eye, Filter, Search } from 'lucide-react';
import { useProducts } from '../hooks/useSupabaseData';
import { formatKES } from '../lib/supabase';

const Shop: React.FC = () => {
  const { products, loading, error } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'Bouncy Castle', 'Slide', 'Trampoline', 'Apparel', 'Accessories'];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-royal-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading our amazing products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Unable to load products</p>
          <p className="text-white/80">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-20 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute top-20 right-20 w-24 h-16 bg-star-yellow/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-10 left-1/4 w-28 h-18 bg-fun-pink/15 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-lg">
            Fun <span className="text-star-yellow">Shop</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/95 max-w-4xl mx-auto leading-relaxed">
            Discover our premium collection of play equipment and accessories. Quality guaranteed, fun delivered across Kenya!
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-royal-blue" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Category Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category
                    ? 'bg-royal-blue text-white shadow-lg'
                    : 'bg-white text-royal-blue hover:bg-royal-blue hover:text-white shadow-md'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-3xl group"
              >
                {/* Product Image */}
                <div className="relative overflow-hidden h-56">
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

                  {/* Featured Badge */}
                  {product.featured && (
                    <div className="absolute bottom-3 left-3 bg-star-yellow text-royal-blue px-2 py-1 rounded-full text-xs font-bold">
                      Featured
                    </div>
                  )}

                  {/* Quick View Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-white/90 hover:bg-white text-royal-blue p-3 rounded-full shadow-lg transition-colors duration-300">
                      <Eye className="h-5 w-5" />
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
                  <div className="mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-royal-blue">
                        {formatKES(product.price_kes)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">/day rental</span>
                    <div className="text-xs text-green-600 font-medium mt-1">
                      Free delivery in Nairobi
                    </div>
                  </div>

                  {/* Description */}
                  {product.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                  )}

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

          {/* No Results */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-2">No products found</h3>
              <p className="text-white/80">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-xl text-center">
              <div className="w-16 h-16 bg-grass-green rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-bold text-royal-blue mb-2">Free Delivery</h3>
              <p className="text-gray-600">Free delivery within Nairobi for orders over KES 5,000</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl text-center">
              <div className="w-16 h-16 bg-star-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-bold text-royal-blue mb-2">Safety Guaranteed</h3>
              <p className="text-gray-600">All equipment is safety certified and regularly inspected</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl text-center">
              <div className="w-16 h-16 bg-bright-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-xl font-bold text-royal-blue mb-2">Premium Quality</h3>
              <p className="text-gray-600">High-quality equipment from trusted international brands</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl font-bold text-royal-blue mb-6">
              Need Help Choosing?
            </h2>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Our team is here to help you select the perfect equipment for your event. Get personalized recommendations!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-gradient-to-r from-royal-blue to-blue-600 text-white font-bold text-lg px-8 py-4 rounded-full hover:from-blue-600 hover:to-royal-blue transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Contact Expert
              </a>
              <a
                href="/booking"
                className="bg-gradient-to-r from-star-yellow to-bright-orange text-royal-blue font-bold text-lg px-8 py-4 rounded-full hover:from-bright-orange hover:to-star-yellow transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Book Now
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shop;