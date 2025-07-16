import React, { useState } from 'react';
import { Upload, Save, Trash2, Move, Palette, Image as ImageIcon } from 'lucide-react';
import { supabase, uploadFile, deleteFile, SiteAsset } from '../../lib/supabase';
import { useSiteAssets, useSiteSettings } from '../../hooks/useSupabaseData';

const SiteCustomizationManager: React.FC = () => {
  const { assets, loading: assetsLoading, refetch: refetchAssets } = useSiteAssets();
  const { settings, loading: settingsLoading, refetch: refetchSettings } = useSiteSettings();
  const [uploading, setUploading] = useState(false);
  const [draggedAsset, setDraggedAsset] = useState<SiteAsset | null>(null);

  const pageBackgrounds = [
    { key: 'home_background_color', label: 'Home Page' },
    { key: 'about_background_color', label: 'About Page' },
    { key: 'corporate_background_color', label: 'Corporate Page' },
    { key: 'events_background_color', label: 'Events Page' },
    { key: 'shop_background_color', label: 'Shop Page' },
    { key: 'blog_background_color', label: 'Blog Page' },
    { key: 'contact_background_color', label: 'Contact Page' },
    { key: 'booking_background_color', label: 'Booking Page' },
  ];

  const menuItems = [
    'Home', 'About Us', 'Corporate', 'Events', 'Book Fun Space', 'Shop', 'Blog', 'Contact Us'
  ];

  const handleFileUpload = async (file: File, assetType: string, menuItem?: string) => {
    if (!file) {
      alert('Please select a file to upload');
      return;
    }


    setUploading(true);
    try {
      const bucket = assetType === 'logo' ? 'logos' : 
                    assetType === 'menu_graphic' ? 'menu-graphics' : 
                    assetType === 'footer_image' ? 'footer-images' : 'general-uploads';
      
      console.log(`Uploading ${file.name} to bucket: ${bucket}`);
      const { fileName, publicUrl } = await uploadFile(bucket, file);
      console.log(`Upload successful. Public URL: ${publicUrl}`);

      if (!publicUrl) {
        throw new Error('Failed to get public URL for uploaded file');
      }

      const { data, error } = await supabase
        .from('site_assets')
        .insert([{
          asset_type: assetType,
          image_url: publicUrl,
          menu_item: menuItem || '',
          placement_hint: assetType === 'logo' ? (menuItem === 'footer' ? 'footer' : 'header') : 
                         assetType === 'footer_image' ? 'footer' : '',
          position_x: 0,
          position_y: 0,
          z_index: 1,
          active: true
        }])
        .select();

      if (error) throw error;
      
      alert('Image uploaded successfully!');
      
      // Force refresh of assets to show new upload immediately
      refetchAssets();
      
      // Clear the file input
      const fileInput = document.getElementById(`${assetType}-${menuItem || 'default'}-upload`) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      
    } catch (err) {
      console.error('Upload error:', err);
      alert('Error uploading image: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAsset = async (asset: SiteAsset) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;

    try {
      // Extract filename from URL
      const urlParts = asset.image_url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      if (fileName) {
        const bucket = asset.asset_type === 'logo' ? 'logos' : 
                      asset.asset_type === 'menu_graphic' ? 'menu-graphics' : 
                      asset.asset_type === 'footer_image' ? 'footer-images' : 'general-uploads';
        
        try {
          await deleteFile(bucket, fileName);
        } catch (storageError) {
          console.warn('Could not delete file from storage:', storageError);
          // Continue with database deletion even if storage deletion fails
        }
      }

      const { error } = await supabase
        .from('site_assets')
        .delete()
        .eq('id', asset.id);

      if (error) throw error;
      
      alert('Asset deleted successfully!');
      refetchAssets();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error deleting asset: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleUpdateAssetPosition = async (assetId: string, x: number, y: number) => {
    try {
      const { error } = await supabase
        .from('site_assets')
        .update({ position_x: x, position_y: y })
        .eq('id', assetId);

      if (error) throw error;
      refetchAssets();
    } catch (err) {
      console.error('Error updating position:', err);
    }
  };

  const handleBackgroundColorChange = async (settingKey: string, color: string) => {
    try {
      // Use the upsert function for reliable updates
      const { error } = await supabase.rpc('upsert_site_setting', {
        key: settingKey,
        value: color,
        type: 'color'
      });

      if (error) throw error;
      
      // Show success message
      alert('Background color updated successfully!');
      refetchSettings();
    } catch (err) {
      alert('Error updating background color: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleDragStart = (e: React.DragEvent, asset: SiteAsset) => {
    setDraggedAsset(asset);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedAsset) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    handleUpdateAssetPosition(draggedAsset.id, Math.round(x), Math.round(y));
    setDraggedAsset(null);
  };

  if (assetsLoading || settingsLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-royal-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading customization options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Site Customization</h1>
        <p className="text-gray-600 mt-2">Manage logos, graphics, and page backgrounds</p>
      </div>

      {/* Background Colors */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center mb-6">
          <Palette className="h-6 w-6 text-royal-blue mr-3" />
          <h2 className="text-xl font-bold text-gray-900">Page Background Colors</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pageBackgrounds.map((bg) => (
            <div key={bg.key} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {bg.label}
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={settings[bg.key] || '#4169E1'}
                  onChange={(e) => handleBackgroundColorChange(bg.key, e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <span className="text-sm text-gray-600 font-mono">
                  {settings[bg.key] || '#4169E1'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logo Management */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Logo Management</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Header Logo */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Header Logo</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'logo', 'header');
                }}
                className="hidden"
                id="header-logo-upload"
              />
              <label htmlFor="header-logo-upload" className="cursor-pointer">
                <div className="flex flex-col items-center">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-600 text-sm">Upload Header Logo</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, SVG (Max 5MB)</p>
                </div>
              </label>
            </div>
            
            {/* Current Header Logos */}
            <div className="mt-4 space-y-2">
              {assets.filter(asset => asset.asset_type === 'logo' && asset.placement_hint === 'header').map((asset) => (
                <div key={asset.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <img 
                      src={asset.image_url} 
                      alt="Header Logo" 
                      className="h-8 w-auto"
                      onError={(e) => {
                        console.error('Logo failed to load:', asset.image_url);
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNiA4TDIwIDEySDEyTDE2IDhaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik04IDE2TDEyIDIwVjEyTDggMTZaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0yNCAxNkwyMCAyMFYxMkwyNCAxNloiIGZpbGw9IiM5QjlCQTAiLz4KPHA+PC9wYXRoPgo8L3N2Zz4K';
                      }}
                    />
                    <span className="text-xs text-gray-500 truncate max-w-32">{asset.image_url.split('/').pop()}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteAsset(asset)}
                    className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
                    title="Delete logo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {assets.filter(asset => asset.asset_type === 'logo' && asset.placement_hint === 'header').length === 0 && (
                <p className="text-sm text-gray-500 italic">No header logo uploaded</p>
              )}
            </div>
          </div>

          {/* Footer Logo */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Footer Logo</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'logo', 'footer');
                }}
                className="hidden"
                id="footer-logo-upload"
              />
              <label htmlFor="footer-logo-upload" className="cursor-pointer">
                <div className="flex flex-col items-center">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-600 text-sm">Upload Footer Logo</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, SVG (Max 5MB)</p>
                </div>
              </label>
            </div>
            
            {/* Current Footer Logos */}
            <div className="mt-4 space-y-2">
              {assets.filter(asset => 
                asset.asset_type === 'logo' && 
                (asset.placement_hint === 'footer' || asset.menu_item === 'footer')
              ).map((asset) => (
                <div key={asset.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <img 
                      src={asset.image_url} 
                      alt="Footer Logo" 
                      className="h-8 w-auto"
                      onError={(e) => {
                        console.error('Footer logo failed to load:', asset.image_url);
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNiA4TDIwIDEySDEyTDE2IDhaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik04IDE2TDEyIDIwVjEyTDggMTZaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0yNCAxNkwyMCAyMFYxMkwyNCAxNloiIGZpbGw9IiM5QjlCQTAiLz4KPHA+PC9wYXRoPgo8L3N2Zz4K';
                      }}
                    />
                    <span className="text-xs text-gray-500 truncate max-w-32">{asset.image_url.split('/').pop()}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteAsset(asset)}
                    className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
                    title="Delete logo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {assets.filter(asset => 
                asset.asset_type === 'logo' && 
                (asset.placement_hint === 'footer' || asset.menu_item === 'footer')
              ).length === 0 && (
                <p className="text-sm text-gray-500 italic">No footer logo uploaded</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Graphics */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Menu Item Graphics</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {menuItems.map((menuItem) => (
            <div key={menuItem} className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-800">{menuItem}</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, 'menu_graphic', menuItem);
                  }}
                  className="hidden"
                  id={`menu-${menuItem.replace(/\s+/g, '-').toLowerCase()}-upload`}
                />
                <label htmlFor={`menu-${menuItem.replace(/\s+/g, '-').toLowerCase()}-upload`} className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <ImageIcon className="h-6 w-6 text-gray-400 mb-1" />
                    <p className="text-xs text-gray-600">Upload</p>
                    <p className="text-xs text-gray-400">Max 5MB</p>
                  </div>
                </label>
              </div>
              
              {/* Current Graphics */}
              <div className="space-y-1">
                {assets.filter(asset => asset.asset_type === 'menu_graphic' && asset.menu_item === menuItem).map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between p-1 bg-gray-50 rounded text-xs">
                    <img 
                      src={asset.image_url} 
                      alt={`${menuItem} graphic`} 
                      className="h-6 w-auto"
                      onError={(e) => {
                        console.error('Menu graphic failed to load:', asset.image_url);
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA2TDE1IDlIOUwxMiA2WiIgZmlsbD0iIzlCOUJBMCIvPgo8cGF0aCBkPSJNNiAxMkw5IDE1VjlMNiAxMloiIGZpbGw9IiM5QjlCQTAiLz4KPHA+PC9wYXRoPgo8L3N2Zz4K';
                      }}
                    />
                    <button
                      onClick={() => handleDeleteAsset(asset)}
                      className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
                      title="Delete graphic"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {assets.filter(asset => asset.asset_type === 'menu_graphic' && asset.menu_item === menuItem).length === 0 && (
                  <p className="text-xs text-gray-400 italic">No graphic</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Images with Drag & Drop Positioning */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Footer Images (Drag & Drop Positioning)</h2>
        
        <div className="mb-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, 'footer_image');
              }}
              className="hidden"
              id="footer-image-upload"
            />
            <label htmlFor="footer-image-upload" className="cursor-pointer">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Upload Footer Image</p>
            </label>
          </div>
        </div>

        {/* Footer Preview Area */}
        <div 
          className="relative bg-gray-100 border-2 border-gray-300 rounded-lg h-64 overflow-hidden"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <p className="absolute top-2 left-2 text-sm text-gray-500">Footer Preview Area (Drag images to position)</p>
          
          {assets.filter(asset => asset.asset_type === 'footer_image').map((asset) => (
            <div
              key={asset.id}
              className="absolute cursor-move"
              style={{
                left: asset.position_x,
                top: asset.position_y,
                zIndex: asset.z_index
              }}
              draggable
              onDragStart={(e) => handleDragStart(e, asset)}
            >
              <div className="relative group">
                <img 
                  src={asset.image_url} 
                  alt="Footer image" 
                  className="max-w-20 max-h-20 object-contain border border-white shadow-sm rounded"
                  onError={(e) => {
                    console.error('Footer image failed to load:', asset.image_url);
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCAyMEw1MCAzMEgzMEw0MCAyMFoiIGZpbGw9IiM5QjlCQTAiLz4KPHA+PC9wYXRoPgo8L3N2Zz4K';
                  }}
                />
                <button
                  onClick={() => handleDeleteAsset(asset)}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-200"
                  title="Delete image"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
                <div className="absolute -bottom-6 left-0 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  <Move className="h-3 w-3 inline mr-1" />
                  Drag to move
                </div>
              </div>
            </div>
          ))}
          
          {assets.filter(asset => asset.asset_type === 'footer_image').length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-400 text-sm">No footer images uploaded</p>
            </div>
          )}
        </div>
      </div>

      {uploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="w-8 h-8 border-4 border-royal-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Uploading image...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteCustomizationManager;