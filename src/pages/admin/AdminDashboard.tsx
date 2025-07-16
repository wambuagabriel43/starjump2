import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Star, 
  LogOut, 
  Home, 
  Image, 
  Calendar, 
  Info, 
  ShoppingCart, 
  MessageSquare,
  Menu,
  X,
  Database,
  Palette
} from 'lucide-react';
import SliderManager from './SliderManager';
import EventsManager from './EventsManager';
import InfoSectionManager from './InfoSectionManager';
import ProductsManager from './ProductsManager';
import BookingCTAManager from './BookingCTAManager';
import DashboardHome from './DashboardHome';
import SupabaseEventsManager from './SupabaseEventsManager';
import SupabaseProductsManager from './SupabaseProductsManager';
import SiteCustomizationManager from './SiteCustomizationManager';
import DiagnosticPage from './DiagnosticPage';
import NavigationManager from './NavigationManager';
import PageManager from './PageManager';
import ContentManager from './ContentManager';
import PageContentManager from './PageContentManager';
import { FileText } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Diagnostics', href: '/admin/diagnostics', icon: Database },
    { name: 'Navigation', href: '/admin/navigation', icon: Menu },
    { name: 'Page Manager', href: '/admin/pages', icon: FileText },
    { name: 'Page Content', href: '/admin/page-content', icon: FileText },
    { name: 'Site Customization', href: '/admin/customization', icon: Palette },
    { name: 'Events (Supabase)', href: '/admin/supabase-events', icon: Database },
    { name: 'Products (Supabase)', href: '/admin/supabase-products', icon: Database },
    { name: 'Image Slider', href: '/admin/slider', icon: Image },
    { name: 'Info Section', href: '/admin/info', icon: Info },
    { name: 'Booking CTA', href: '/admin/booking-cta', icon: MessageSquare },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 bg-royal-blue">
          <div className="flex items-center space-x-2">
            <Star className="h-8 w-8 text-star-yellow" fill="currentColor" />
            <span className="text-xl font-bold text-white">Star Jump Admin</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-white hover:text-star-yellow transition-colors duration-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8">
          <div className="px-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-royal-blue text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-royal-blue'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-300"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-royal-blue transition-colors duration-300"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 text-royal-blue px-3 py-1 rounded-full text-sm font-medium">
                🇰🇪 Kenya Edition
              </div>
              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-royal-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 text-sm font-medium"
              >
                View Website
              </Link>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/diagnostics" element={<DiagnosticPage />} />
            <Route path="/navigation" element={<NavigationManager />} />
            <Route path="/pages" element={<PageManager />} />
            <Route path="/page-content" element={<PageContentManager />} />
            <Route path="/customization" element={<SiteCustomizationManager />} />
            <Route path="/slider" element={<SliderManager />} />
            <Route path="/supabase-events" element={<SupabaseEventsManager />} />
            <Route path="/supabase-products" element={<SupabaseProductsManager />} />
            <Route path="/info" element={<InfoSectionManager />} />
            <Route path="/booking-cta" element={<BookingCTAManager />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;