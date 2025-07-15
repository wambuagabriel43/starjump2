import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Star, Settings } from 'lucide-react';
import { useSiteAssets, useMenuItems } from '../hooks/useSupabaseData';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { assets } = useSiteAssets();
  const { menuItems } = useMenuItems();
  
  // Get header logo
  const headerLogo = assets.find(asset => 
    asset.asset_type === 'logo' && 
    (asset.placement_hint === 'header' || !asset.placement_hint)
  );

  // Filter active menu items and sort by order
  const activeMenuItems = menuItems.filter(item => item.active).sort((a, b) => a.order_position - b.order_position);
  return (
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
                  className="h-16 w-auto"
                />
              ) : (
                <div className="flex items-center bg-white rounded-full p-3 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Star className="h-8 w-8 text-royal-blue mr-1" fill="currentColor" />
                  <span className="font-bold text-xl text-royal-blue">STAR</span>
                </div>
              )}
              <div className="hidden sm:block">
                <span className="font-bold text-2xl accent-themed drop-shadow-lg">JUMP</span>
              </div>
            </Link>

            {/* Desktop Navigation with Colorful Clouds */}
            <div className="hidden lg:flex items-center space-x-2">
              {activeMenuItems.map((item) => (
                <div key={item.id} className="relative">
                  <div className={`absolute inset-0 bg-star-yellow rounded-full transform scale-110 opacity-80 menu-${item.label.toLowerCase().replace(/\s+/g, '-')}`}></div>
                  <Link
                    to={item.url}
                    target={item.target}
                    className="relative px-4 py-2 rounded-full text-themed font-bold text-sm hover:text-royal-blue transition-all duration-300 transform hover:scale-105 z-10"
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
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
                >
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t-4 border-star-yellow">
            <div className="px-4 py-2 space-y-1">
              {activeMenuItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.url}
                  target={item.target}
                  className="block px-4 py-3 rounded-lg text-royal-blue font-medium hover:bg-royal-blue hover:text-white transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
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
    </header>
  );
};

export default Header;