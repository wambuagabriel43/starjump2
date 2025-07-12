import React from 'react';
import { useContent } from '../../context/ContentContext';
import { Image, Calendar, Info, ShoppingCart, MessageSquare, TrendingUp } from 'lucide-react';

const DashboardHome: React.FC = () => {
  const { content } = useContent();

  const stats = [
    {
      name: 'Image Slides',
      value: content.slides.length,
      icon: Image,
      color: 'bg-blue-500'
    },
    {
      name: 'Events',
      value: content.events.length,
      icon: Calendar,
      color: 'bg-green-500'
    },
    {
      name: 'Products',
      value: content.products.length,
      icon: ShoppingCart,
      color: 'bg-purple-500'
    },
    {
      name: 'CTA Features',
      value: content.bookingCTA.features.length,
      icon: MessageSquare,
      color: 'bg-orange-500'
    }
  ];

  const quickActions = [
    {
      name: 'Update Image Slider',
      description: 'Manage homepage slider images and text',
      href: '/admin/slider',
      icon: Image,
      color: 'bg-blue-500'
    },
    {
      name: 'Manage Events',
      description: 'Add, edit, or remove upcoming events',
      href: '/admin/events',
      icon: Calendar,
      color: 'bg-green-500'
    },
    {
      name: 'Edit Info Section',
      description: 'Update company information and benefits',
      href: '/admin/info',
      icon: Info,
      color: 'bg-indigo-500'
    },
    {
      name: 'Manage Products',
      description: 'Update shop products and pricing',
      href: '/admin/products',
      icon: ShoppingCart,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your Star Jump website content</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className={`${stat.color} rounded-lg p-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <a
                key={action.name}
                href={action.href}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-300 group"
              >
                <div className="flex items-start">
                  <div className={`${action.color} rounded-lg p-3 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-royal-blue transition-colors duration-300">
                      {action.name}
                    </h3>
                    <p className="text-gray-600 mt-1">{action.description}</p>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center mb-4">
          <TrendingUp className="h-5 w-5 text-royal-blue mr-2" />
          <h2 className="text-xl font-bold text-gray-900">Website Overview</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600">Homepage Slider</span>
            <span className="text-green-600 font-medium">Active</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600">Events Section</span>
            <span className="text-green-600 font-medium">{content.events.length} Events</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600">Shop Products</span>
            <span className="text-green-600 font-medium">{content.products.length} Products</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-gray-600">Booking System</span>
            <span className="text-green-600 font-medium">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;