import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, Star } from 'lucide-react';
import { supabase, Product, formatKES, productCategories } from '../../lib/supabase';
import { useProducts } from '../../hooks/useSupabaseData';

const SupabaseProductsManager: React.FC = () => {
  const { products, loading, error, refetch } = useProducts();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    image_url: '',
    price_kes: 0,
    category: '',
    rating: 5,
    in_stock: true,
    featured: false
  });

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      image_url: product.image_url,
      price_kes: product.price_kes,
      category: product.category,
      rating: product.rating,
      in_stock: product.in_stock,
      featured: product.featured
    });
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      image_url: '',
      price_kes: 0,
      category: productCategories[0],
      rating: 5,
      in_stock: true,
      featured: false
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (isAddingNew) {
        const { error } = await supabase
          .from('products')
          .insert([formData]);
        
        if (error) throw error;
        alert('Product added successfully!');
      } else if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(formData)
          .eq('id', editingProduct.id);
        
        if (error) throw error;
        alert('Product updated successfully!');
      }
      
      handleCancel();
      refetch();
    } catch (err) {
      alert('Error saving product: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      alert('Product deleted successfully!');
      refetch();
    } catch (err) {
      alert('Error deleting product: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setIsAddingNew(false);
    setFormData({
      name: '',
      description: '',
      image_url: '',
      price_kes: 0,
      category: '',
      rating: 5,
      in_stock: true,
      featured: false
    });
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-royal-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products from Supabase...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <p className="text-red-600">Error loading products: {error}</p>
          <button 
            onClick={refetch}
            className="mt-4 bg-royal-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products Manager (Supabase)</h1>
          <p className="text-gray-600 mt-2">Manage shop products and pricing in KES</p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-royal-blue text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors duration-300 flex items-center space-x-2 shadow-lg"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Edit Form */}
      {(editingProduct || isAddingNew) && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {isAddingNew ? 'Add New Product' : 'Edit Product'}
            </h2>
            <button
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-colors duration-300"
                  placeholder="Product name"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (KES) *
                  </label>
                  <input
                    type="number"
                    value={formData.price_kes || 0}
                    onChange={(e) => setFormData({ ...formData, price_kes: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-colors duration-300"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <select
                    value={formData.rating || 5}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-colors duration-300"
                  >
                    <option value={1}>1 Star</option>
                    <option value={2}>2 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={5}>5 Stars</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-colors duration-300"
                  required
                >
                  <option value="">Select category</option>
                  {productCategories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-colors duration-300 resize-none"
                  placeholder="Product description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL *
                </label>
                <input
                  type="url"
                  value={formData.image_url || ''}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-colors duration-300"
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="in_stock"
                    checked={formData.in_stock || false}
                    onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                    className="h-4 w-4 text-royal-blue focus:ring-royal-blue border-gray-300 rounded"
                  />
                  <label htmlFor="in_stock" className="ml-2 block text-sm text-gray-900">
                    In Stock
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured || false}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="h-4 w-4 text-royal-blue focus:ring-royal-blue border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                    Featured Product
                  </label>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors duration-300 flex items-center space-x-2 disabled:opacity-50"
                >
                  <Save className="h-5 w-5" />
                  <span>{isSaving ? 'Saving...' : 'Save'}</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-colors duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                <div className="h-48 bg-gray-100 overflow-hidden">
                  {formData.image_url ? (
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <span>Product Image</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-royal-blue text-white px-2 py-1 rounded-full text-xs font-bold">
                      {formData.category || 'Category'}
                    </span>
                    <div className="flex items-center space-x-1">
                      {formData.featured && (
                        <span className="bg-star-yellow text-royal-blue px-2 py-1 rounded-full text-xs font-bold">
                          Featured
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        formData.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {formData.in_stock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-royal-blue mb-2">
                    {formData.name || 'Product Name'}
                  </h3>
                  <div className="flex items-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < (formData.rating || 5)
                            ? 'text-star-yellow fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">({formData.rating || 5}.0)</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-2xl font-bold text-royal-blue">
                        {formatKES(formData.price_kes || 0)}
                      </span>
                      <span className="text-sm text-gray-600 ml-1">/day</span>
                    </div>
                  </div>
                  {formData.description && (
                    <p className="text-gray-600 text-sm mt-2">{formData.description}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-48 bg-gray-100 overflow-hidden">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="bg-royal-blue text-white px-2 py-1 rounded-full text-xs font-bold">
                  {product.category}
                </span>
                <div className="flex items-center space-x-1">
                  {product.featured && (
                    <span className="bg-star-yellow text-royal-blue px-2 py-1 rounded-full text-xs font-bold">
                      Featured
                    </span>
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    product.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.in_stock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-royal-blue mb-2">{product.name}</h3>
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
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-2xl font-bold text-royal-blue">
                    {formatKES(product.price_kes)}
                  </span>
                  <span className="text-sm text-gray-600 ml-1">/day</span>
                </div>
              </div>
              {product.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
              )}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="flex-1 bg-blue-100 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors duration-300 flex items-center justify-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-100 text-red-600 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors duration-300"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
          <p className="text-gray-600">Get started by adding your first product for Kenya.</p>
        </div>
      )}
    </div>
  );
};

export default SupabaseProductsManager;