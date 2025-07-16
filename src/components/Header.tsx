import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Star, Settings } from 'lucide-react';
import { useSiteAssets, useMenuItems } from '../hooks/useSupabaseData';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { assets, loading: assetsLoading, error: assetsError } = useSiteAssets();
  const { menuItems, loading: menuLoading, error: menuError } = useMenuItems();
  
  // Get header logo
  const headerLogo = assets.find(asset => 
    asset.asset_type === 'logo' && 
    (asset.placement_hint === 'header' || asset.placement_hint === '' || !asset.placement_hint)
  );

  // Filter active menu items and sort by order
  const activeMenuItems = menuItems
    .filter(item => item.active && item.menu_type === 'main')
    .sort((a, b) => a.order_position - b.order_position);

  // Generate menu graphics CSS
  const menuGraphicsCSS = assets
    .filter(asset => asset.asset_type === 'menu_graphic' && asset.active)
    .map((asset) => {
      if (!asset.menu_item) return '';
      const menuClass = asset.menu_item.toLowerCase().replace(/\s+/g, '-');
      return `
        .menu-${menuClass} {
          background-image: url('${asset.image_url}');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
      `;
    }).join('\n');

  // Show loading state
  if (assetsLoading || menuLoading) {
    return (
      <header className="relative z-50">
        <nav className="header-themed shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-full animate-pulse"></div>
                <div className="w-20 h-6 bg-white/20 rounded animate-pulse"></div>
              </div>
              <div className="hidden lg:flex space-x-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-16 h-8 bg-white/20 rounded-full animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <>
      {/* Inject menu graphics CSS */}
      <style>{menuGraphicsCSS}</style>
      
      <header className="relative z-50">
        {/* Floating cloud decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-4 left-20 w-16 h-10 bg-white rounded-full opacity-90 animate-float"></div>
          <div className="absolute top-8 left-40 w-12 h-8 bg-white rounded-full opacity-80 animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-2 right-32 w-20 h-12 bg-white rounded-full opacity-85 animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <nav className="relative header-themed shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-2 group">
                {headerLogo ? (
                  <img 
                    src={headerLogo.image_url} 
                    alt="Star Jump Logo" 
                    className="h-12 w-auto max-w-48 transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      console.error('Header logo failed to load:', headerLogo.image_url);
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.classList.remove('hidden');
                    }}
                  />
                ) : null}
                
                {/* Default logo (shown if no custom logo or if custom logo fails) */}
                <div className={`flex items-center bg-white rounded-full p-3 shadow-lg group-hover:shadow-xl transition-shadow duration-300 ${headerLogo ? 'hidden' : ''}`}>
                  <Star className="h-8 w-8 text-royal-blue mr-1" fill="currentColor" />
                  <span className="font-bold text-xl text-royal-blue">STAR</span>
                </div>
                
                <div className="hidden sm:block">
                  <span className="font-bold text-2xl accent-themed drop-shadow-lg">JUMP</span>
                </div>
              </Link>

              {/* Desktop Navigation with Colorful Clouds */}
              <div className="hidden lg:flex items-center space-x-2">
                {activeMenuItems.length > 0 ? (
                  activeMenuItems.map((item) => {
                    const menuClass = `menu-${item.label.toLowerCase().replace(/\s+/g, '-')}`;
                    return (
                      <div key={item.id} className="relative">
                        <div className={`absolute inset-0 bg-star-yellow rounded-full transform scale-110 opacity-80 ${menuClass}`}></div>
                        <Link
                          to={item.url}
                          target={item.target || '_self'}
                          className="relative px-4 py-2 rounded-full text-themed font-bold text-sm hover:text-royal-blue transition-all duration-300 transform hover:scale-105 z-10"
                        >
                          {item.label}
                        </Link>
                      </div>
                    );
                  })
                ) : (
                  // Fallback navigation if no menu items in database
                  <>
                    <div className="relative">
                      <div className="absolute inset-0 bg-star-yellow rounded-full transform scale-110 opacity-80"></div>
                      <Link to="/" className="relative px-4 py-2 rounded-full text-themed font-bold text-sm hover:text-royal-blue transition-all duration-300 transform hover:scale-105 z-10">Home</Link>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-fun-pink rounded-full transform scale-110 opacity-80"></div>
                      <Link to="/about" className="relative px-4 py-2 rounded-full text-themed font-bold text-sm hover:text-royal-blue transition-all duration-300 transform hover:scale-105 z-10">About</Link>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-grass-green rounded-full transform scale-110 opacity-80"></div>
                      <Link to="/events" className="relative px-4 py-2 rounded-full text-themed font-bold text-sm hover:text-royal-blue transition-all duration-300 transform hover:scale-105 z-10">Events</Link>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-bright-orange rounded-full transform scale-110 opacity-80"></div>
                      <Link to="/shop" className="relative px-4 py-2 rounded-full text-themed font-bold text-sm hover:text-royal-blue transition-all duration-300 transform hover:scale-105 z-10">Shop</Link>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-star-yellow rounded-full transform scale-110 opacity-80"></div>
                      <Link to="/contact" className="relative px-4 py-2 rounded-full text-themed font-bold text-sm hover:text-royal-blue transition-all duration-300 transform hover:scale-105 z-10">Contact</Link>
                    </div>
                  </>
                )}
              </div>

              {/* Right side - Admin Link & Mobile Menu */}
              <div className="flex items-center space-x-4">
                {/* Admin Login Link */}
                <Link
                  to="/admin/login"
                  className="hidden sm:flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-themed px-4 py-2 rounded-full hover:bg-white hover:text-royal-blue transition-all duration-300 transform hover:scale-105 border border-white/20"
                  title="Admin Login"
                >
                  <Settings className="h-4 w-4" />
                  <span className="text-sm font-medium">Admin</span>
                </Link>

                {/* Mobile Admin Link */}
                <Link
                  to="/admin/login"
                  className="sm:hidden p-2 rounded-md text-themed hover:bg-white hover:text-royal-blue transition-colors duration-300"
                  title="Admin Login"
                >
                  <Settings className="h-5 w-5" />
                </Link>

                {/* Mobile menu button */}
                <div className="lg:hidden">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 rounded-md text-themed hover:bg-white hover:text-royal-blue transition-colors duration-300"
                    aria-label="Toggle mobile menu"
                  >
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t-4 border-star-yellow z-50">
              <div className="px-4 py-2 space-y-1">
                {activeMenuItems.length > 0 ? (
                  activeMenuItems.map((item) => (
                    <Link
                      key={item.id}
                      to={item.url}
                      target={item.target || '_self'}
                      className="block px-4 py-3 rounded-lg text-royal-blue font-medium hover:bg-royal-blue hover:text-white transition-colors duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))
                ) : (
                  // Fallback mobile navigation
                  <>
                    <Link to="/" className="block px-4 py-3 rounded-lg text-royal-blue font-medium hover:bg-royal-blue hover:text-white transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>Home</Link>
                    <Link to="/about" className="block px-4 py-3 rounded-lg text-royal-blue font-medium hover:bg-royal-blue hover:text-white transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>About</Link>
                    <Link to="/events" className="block px-4 py-3 rounded-lg text-royal-blue font-medium hover:bg-royal-blue hover:text-white transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>Events</Link>
                    <Link to="/shop" className="block px-4 py-3 rounded-lg text-royal-blue font-medium hover:bg-royal-blue hover:text-white transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>Shop</Link>
                    <Link to="/contact" className="block px-4 py-3 rounded-lg text-royal-blue font-medium hover:bg-royal-blue hover:text-white transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>Contact</Link>
                  </>
                )}
                
                {/* Mobile Admin Link in Menu */}
                <Link
                  to="/admin/login"
                  className="block px-4 py-3 rounded-lg text-royal-blue font-medium hover:bg-royal-blue hover:text-white transition-colors duration-300 border-t border-gray-200 mt-2 pt-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>Admin Login</span>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </nav>

        {/* Error Display for Development */}
        {(assetsError || menuError) && process.env.NODE_ENV === 'development' && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 text-sm">
            {assetsError && <div>Assets Error: {assetsError}</div>}
            {menuError && <div>Menu Error: {menuError}</div>}
          </div>
        )}
      </header>
    </>
  );
};

export default Header;