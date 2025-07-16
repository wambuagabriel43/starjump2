import React, { useState } from 'react';
import { Upload, Save, Trash2, Move, Palette, Image as ImageIcon, RotateCcw } from 'lucide-react';
import { supabase, uploadFile, deleteFile, SiteAsset } from '../../lib/supabase';
import { useSiteAssets, useSiteSettings } from '../../hooks/useSupabaseData';

const SiteCustomizationManager: React.FC = () => {
  const { assets, loading: assetsLoading, refetch: refetchAssets } = useSiteAssets();
  const { settings, loading: settingsLoading, refetch: refetchSettings } = useSiteSettings();
  const [uploading, setUploading] = useState(false);
  const [draggedAsset, setDraggedAsset] = useState<SiteAsset | null>(null);

  const handleMenuModeChange = async (mode: string) => {
    try {
      const { error } = await supabase.rpc('upsert_site_setting', {
        key: 'menu_navigation_mode',
        value: mode,
        type: 'text'
      });

      if (error) throw error;
      refetchSettings();
    } catch (err) {
      alert('Error updating menu mode: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleMenuGraphicsSizeChange = async (size: number) => {
    try {
      const { error } = await supabase.rpc('upsert_site_setting', {
        key: 'menu_graphics_size',
        value: size.toString(),
        type: 'number'
      });

      if (error) throw error;
      refetchSettings();
    } catch (err) {
      alert('Error updating menu graphics size: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

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

  const handleUpdateAssetSize = async (assetId: string, width: number, height: number) => {
    try {
      const { error } = await supabase
        .from('site_assets')
        .update({ width, height })
        .eq('id', assetId);

      if (error) throw error;
      refetchAssets();
    } catch (err) {
      console.error('Error updating size:', err);
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

  // Resizable Footer Image Component
  const ResizableFooterImage: React.FC<{
    asset: SiteAsset;
    onDelete: (asset: SiteAsset) => void;
    onMove: (id: string, x: number, y: number) => void;
    onResize: (id: string, width: number, height: number) => void;
    onDragStart: (e: React.DragEvent, asset: SiteAsset) => void;
  }> = ({ asset, onDelete, onMove, onResize, onDragStart }) => {
    const [isResizing, setIsResizing] = useState(false);
    const [resizeHandle, setResizeHandle] = useState<string | null>(null);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [startSize, setStartSize] = useState({ width: 0, height: 0 });

    const currentWidth = asset.width || 80;
    const currentHeight = asset.height || 80;

    const handleResizeStart = (e: React.MouseEvent, handle: string) => {
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);
      setResizeHandle(handle);
      setStartPos({ x: e.clientX, y: e.clientY });
      setStartSize({ width: currentWidth, height: currentHeight });
    };

    const handleResizeMove = (e: MouseEvent) => {
      if (!isResizing || !resizeHandle) return;

      const deltaX = e.clientX - startPos.x;
      const deltaY = e.clientY - startPos.y;
      
      let newWidth = startSize.width;
      let newHeight = startSize.height;
      
      // Calculate new dimensions based on handle
      if (resizeHandle.includes('right')) {
        newWidth = Math.max(40, startSize.width + deltaX);
      }
      if (resizeHandle.includes('left')) {
        newWidth = Math.max(40, startSize.width - deltaX);
      }
      if (resizeHandle.includes('bottom')) {
        newHeight = Math.max(40, startSize.height + deltaY);
      }
      if (resizeHandle.includes('top')) {
        newHeight = Math.max(40, startSize.height - deltaY);
      }

      // Maintain aspect ratio for corner handles
      if (resizeHandle.includes('corner')) {
        const aspectRatio = startSize.width / startSize.height;
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          newHeight = newWidth / aspectRatio;
        } else {
          newWidth = newHeight * aspectRatio;
        }
      }

      // Apply size limits
      newWidth = Math.min(200, Math.max(40, newWidth));
      newHeight = Math.min(200, Math.max(40, newHeight));

      onResize(asset.id, Math.round(newWidth), Math.round(newHeight));
    };

    const handleResizeEnd = () => {
      setIsResizing(false);
      setResizeHandle(null);
    };

    React.useEffect(() => {
      if (isResizing) {
        document.addEventListener('mousemove', handleResizeMove);
        document.addEventListener('mouseup', handleResizeEnd);
        return () => {
          document.removeEventListener('mousemove', handleResizeMove);
          document.removeEventListener('mouseup', handleResizeEnd);
        };
      }
    }, [isResizing, resizeHandle, startPos, startSize]);

    return (
      <div
        className="absolute cursor-move group"
        style={{
          left: asset.position_x,
          top: asset.position_y,
          zIndex: asset.z_index,
          width: currentWidth,
          height: currentHeight
        }}
        draggable={!isResizing}
        onDragStart={(e) => !isResizing && onDragStart(e, asset)}
      >
        <img 
          src={asset.image_url} 
          alt="Footer image" 
          className="w-full h-full object-contain border border-white shadow-sm rounded"
          style={{ pointerEvents: isResizing ? 'none' : 'auto' }}
          onError={(e) => {
            console.error('Footer image failed to load:', asset.image_url);
            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCAyMEw1MCAzMEgzMEw0MCAyMFoiIGZpbGw9IiM5QjlCQTAiLz4KPHA+PC9wYXRoPgo8L3N2Zz4K';
          }}
        />
        
        {/* Delete Button */}
        <button
          onClick={() => onDelete(asset)}
          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
          title="Delete image"
        >
          <Trash2 className="h-3 w-3" />
        </button>
        
        {/* Reset Size Button */}
        <button
          onClick={() => onResize(asset.id, 80, 80)}
          className="absolute -top-2 -left-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
          title="Reset to original size"
        >
          <RotateCcw className="h-3 w-3" />
        </button>

        {/* Resize Handles */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Corner handles */}
          <div
            className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-nw-resize"
            onMouseDown={(e) => handleResizeStart(e, 'corner-top-left')}
          />
          <div
            className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-ne-resize"
            onMouseDown={(e) => handleResizeStart(e, 'corner-top-right')}
          />
          <div
            className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-sw-resize"
            onMouseDown={(e) => handleResizeStart(e, 'corner-bottom-left')}
          />
          <div
            className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-se-resize"
            onMouseDown={(e) => handleResizeStart(e, 'corner-bottom-right')}
          />
          
          {/* Edge handles */}
          <div
            className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-blue-500 border border-white rounded cursor-n-resize"
            onMouseDown={(e) => handleResizeStart(e, 'edge-top')}
          />
          <div
            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-blue-500 border border-white rounded cursor-s-resize"
            onMouseDown={(e) => handleResizeStart(e, 'edge-bottom')}
          />
          <div
            className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-3 bg-blue-500 border border-white rounded cursor-w-resize"
            onMouseDown={(e) => handleResizeStart(e, 'edge-left')}
          />
          <div
            className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-3 bg-blue-500 border border-white rounded cursor-e-resize"
            onMouseDown={(e) => handleResizeStart(e, 'edge-right')}
          />
        </div>

        {/* Size Info */}
        <div className="absolute -bottom-6 left-0 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {isResizing ? (
            <span>Resizing: {currentWidth}×{currentHeight}px</span>
          ) : (
            <>
              <Move className="h-3 w-3 inline mr-1" />
              Drag to move • Drag corners to resize
            </>
          )}
        </div>
      </div>
    );
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-gray-900 mr-4">Menu Navigation Settings</h2>
          </div>
        </div>

        {/* Menu Design Mode Toggle */}
        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Navigation Style</h3>
              <p className="text-sm text-gray-600">Choose between text-based navigation or graphics-only navigation</p>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="menuMode"
                  value="text"
                  checked={settings.menu_navigation_mode !== 'graphics'}
                  onChange={() => handleMenuModeChange('text')}
                  className="mr-2"
                />
                <span className="text-sm font-medium">Text Navigation</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="menuMode"
                  value="graphics"
                  checked={settings.menu_navigation_mode === 'graphics'}
                  onChange={() => handleMenuModeChange('graphics')}
                  className="mr-2"
                />
                <span className="text-sm font-medium">Graphics Only</span>
              </label>
            </div>
          </div>

          {/* Menu Graphics Size Control */}
          {settings.menu_navigation_mode === 'graphics' && (
            <div className="mt-4 p-4 bg-white rounded-lg border">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Menu Graphics Size: {settings.menu_graphics_size || 60}px
              </label>
              <input
                type="range"
                min="24"
                max="80"
                value={settings.menu_graphics_size || 60}
                onChange={(e) => handleMenuGraphicsSizeChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>24px</span>
                <span>80px</span>
              </div>
            </div>
          )}
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Menu Graphics</h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {menuItems.map((menuItem) => (
            <div key={menuItem} className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-800">{menuItem}</h3>
              <p className="text-xs text-gray-500">Class: menu-{menuItem.toLowerCase().replace(/\s+/g, '-')}</p>
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
            <ResizableFooterImage
              key={asset.id}
              asset={asset}
              onDelete={handleDeleteAsset}
              onMove={handleUpdateAssetPosition}
              onResize={handleUpdateAssetSize}
              onDragStart={handleDragStart}
            />
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