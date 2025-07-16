import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, GripVertical, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useMenuItems } from '../../hooks/useSupabaseData';

interface MenuItem {
  id: string;
  menu_type: string;
  label: string;
  url: string;
  target: string;
  parent_id: string | null;
  order_position: number;
  active: boolean;
  icon: string | null;
}

const NavigationManager: React.FC = () => {
  const { menuItems, loading, error, refetch } = useMenuItems();
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [draggedItem, setDraggedItem] = useState<MenuItem | null>(null);
  
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    menu_type: 'main',
    label: '',
    url: '',
    target: '_self',
    parent_id: null,
    order_position: 0,
    active: true,
    icon: null
  });

  const availablePages = [
    { label: 'Home', url: '/' },
    { label: 'About Us', url: '/about' },
    { label: 'Corporate', url: '/corporate' },
    { label: 'Events', url: '/events' },
    { label: 'Booking', url: '/booking' },
    { label: 'Shop', url: '/shop' },
    { label: 'Blog', url: '/blog' },
    { label: 'Contact Us', url: '/contact' },
    { label: 'Privacy Policy', url: '/privacy-policy' },
    { label: 'Terms & Conditions', url: '/terms-conditions' }
  ];

  // Add default menu items if none exist
  const createDefaultMenuItems = async () => {
    try {
      const defaultItems = [
        { label: 'Home', url: '/', order_position: 1 },
        { label: 'About Us', url: '/about', order_position: 2 },
        { label: 'Corporate', url: '/corporate', order_position: 3 },
        { label: 'Events', url: '/events', order_position: 4 },
        { label: 'Booking', url: '/booking', order_position: 5 },
        { label: 'Shop', url: '/shop', order_position: 6 },
        { label: 'Blog', url: '/blog', order_position: 7 },
        { label: 'Contact Us', url: '/contact', order_position: 8 }
      ];

      for (const item of defaultItems) {
        await supabase.from('menu_items').insert([{
          menu_type: 'main',
          label: item.label,
          url: item.url,
          target: '_self',
          parent_id: null,
          order_position: item.order_position,
          active: true,
          icon: null
        }]);
      }
      
      alert('Default menu items created successfully!');
      refetch();
    } catch (err) {
      console.error('Error creating default menu items:', err);
      alert('Error creating default menu items');
    }
  };

  const iconOptions = [
    'Home', 'Info', 'Building2', 'Calendar', 'ShoppingCart', 
    'FileText', 'Mail', 'Shield', 'BookOpen', 'Users'
  ];

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      menu_type: item.menu_type,
      label: item.label,
      url: item.url,
      target: item.target,
      parent_id: item.parent_id,
      order_position: item.order_position,
      active: item.active,
      icon: item.icon
    });
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingItem(null);
    const nextPosition = Math.max(...menuItems.map(item => item.order_position), 0) + 1;
    setFormData({
      menu_type: 'main',
      label: '',
      url: '',
      target: '_self',
      parent_id: null,
      order_position: nextPosition,
      active: true,
      icon: null
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (isAddingNew) {
        const { error } = await supabase
          .from('menu_items')
          .insert([formData]);
        
        if (error) throw error;
        alert('Menu item added successfully!');
      } else if (editingItem) {
        const { error } = await supabase
          .from('menu_items')
          .update(formData)
          .eq('id', editingItem.id);
        
        if (error) throw error;
        alert('Menu item updated successfully!');
      }
      
      handleCancel();
      refetch();
    } catch (err) {
      alert('Error saving menu item: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      alert('Menu item deleted successfully!');
      refetch();
    } catch (err) {
      alert('Error deleting menu item: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update({ active: !active })
        .eq('id', id);
      
      if (error) throw error;
      refetch();
    } catch (err) {
      alert('Error updating menu item: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleReorder = async (itemId: string, newPosition: number) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update({ order_position: newPosition })
        .eq('id', itemId);
      
      if (error) throw error;
      refetch();
    } catch (err) {
      console.error('Error reordering menu item:', err);
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
    setIsAddingNew(false);
    setFormData({
      menu_type: 'main',
      label: '',
      url: '',
      target: '_self',
      parent_id: null,
      order_position: 0,
      active: true,
      icon: null
    });
  };

  const handleDragStart = (e: React.DragEvent, item: MenuItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetItem: MenuItem) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === targetItem.id) return;

    const newPosition = targetItem.order_position;
    handleReorder(draggedItem.id, newPosition);
    setDraggedItem(null);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-royal-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading navigation menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="flex space-x-3">
            {menuItems.length === 0 && (
              <button
                onClick={createDefaultMenuItems}
                className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors duration-300 flex items-center space-x-2 shadow-lg"
              >
                <Plus className="h-5 w-5" />
                <span>Create Default Menu</span>
              </button>
            )}
            <button
              onClick={handleAddNew}
              className="bg-royal-blue text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors duration-300 flex items-center space-x-2 shadow-lg"
            >
              <Plus className="h-5 w-5" />
              <span>Add Menu Item</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const sortedMenuItems = [...menuItems].sort((a, b) => a.order_position - b.order_position);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Navigation Manager</h1>
          <p className="text-gray-600 mt-2">Manage website navigation menu items and ordering</p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-royal-blue text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors duration-300 flex items-center space-x-2 shadow-lg"
        >
          <Plus className="h-5 w-5" />
          <span>Add Menu Item</span>
        </button>
      </div>

      {/* Edit Form */}
      {(editingItem || isAddingNew) && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {isAddingNew ? 'Add New Menu Item' : 'Edit Menu Item'}
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
                  Label *
                </label>
                <input
                  type="text"
                  value={formData.label || ''}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-colors duration-300"
                  placeholder="Menu item label"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL *
                </label>
                <select
                  value={formData.url || ''}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-colors duration-300"
                  required
                >
                  <option value="">Select a page</option>
                  {availablePages.map((page) => (
                    <option key={page.url} value={page.url}>{page.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target
                  </label>
                  <select
                    value={formData.target || '_self'}
                    onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-colors duration-300"
                  >
                    <option value="_self">Same Window</option>
                    <option value="_blank">New Window</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Position
                  </label>
                  <input
                    type="number"
                    value={formData.order_position || 0}
                    onChange={(e) => setFormData({ ...formData, order_position: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-colors duration-300"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon (Optional)
                </label>
                <select
                  value={formData.icon || ''}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value || null })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-colors duration-300"
                >
                  <option value="">No Icon</option>
                  {iconOptions.map((icon) => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active || false}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="h-4 w-4 text-royal-blue focus:ring-royal-blue border-gray-300 rounded"
                />
                <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                  Active (visible in navigation)
                </label>
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
              <div className="bg-gray-100 rounded-xl p-4">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center space-x-2">
                    {formData.icon && (
                      <div className="w-5 h-5 bg-royal-blue rounded flex items-center justify-center">
                        <span className="text-white text-xs">{formData.icon.charAt(0)}</span>
                      </div>
                    )}
                    <span className="font-medium text-royal-blue">
                      {formData.label || 'Menu Item Label'}
                    </span>
                    {!formData.active && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                        Hidden
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Links to: {formData.url || '/'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Menu Items List */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Current Navigation Menu</h2>
        
        <div className="space-y-2">
          {sortedMenuItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300"
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, item)}
            >
              <div className="flex items-center space-x-4">
                <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                
                <div className="flex items-center space-x-2">
                  <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-bold">
                    {item.order_position}
                  </span>
                  {item.icon && (
                    <div className="w-6 h-6 bg-royal-blue rounded flex items-center justify-center">
                      <span className="text-white text-xs">{item.icon.charAt(0)}</span>
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-gray-900">{item.label}</div>
                    <div className="text-sm text-gray-500">{item.url}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleToggleActive(item.id, item.active)}
                  className={`p-2 rounded-lg transition-colors duration-300 ${
                    item.active 
                      ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                      : 'bg-red-100 text-red-600 hover:bg-red-200'
                  }`}
                  title={item.active ? 'Hide from menu' : 'Show in menu'}
                >
                  {item.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-blue-100 text-blue-600 p-2 rounded-lg hover:bg-blue-200 transition-colors duration-300"
                >
                  <Edit className="h-4 w-4" />
                </button>
                
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors duration-300"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {sortedMenuItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🧭</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No menu items yet</h3>
            <p className="text-gray-600">Get started by adding your first navigation item.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavigationManager;