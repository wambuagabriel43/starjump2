import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Facebook, Instagram, Linkedin, MessageCircle, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useSiteAssets } from '../hooks/useSupabaseData';

const Footer: React.FC = () => {
  const { assets } = useSiteAssets();
  
  // Get footer logo and positioned images
  const footerLogo = assets.find(asset => 
    asset.asset_type === 'logo' && 
    (asset.placement_hint === 'footer' || asset.menu_item === 'footer')
  );
  
  const footerImages = assets.filter(asset => 
    asset.asset_type === 'footer_image' && asset.active
  );

  const locations = [
    'Greenspan Mall, Nairobi',
    'Garden City Mall, Nairobi', 
    'Galleria Mall, Nairobi'
  ];

  return (
    <footer className="footer-themed text-themed relative overflow-hidden">
      {/* Decorative clouds */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-20 w-24 h-16 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute top-20 right-32 w-32 h-20 bg-star-yellow/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-10 left-1/3 w-28 h-18 bg-fun-pink/15 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Positioned Footer Images */}
      {footerImages.map((image) => (
        <div
          key={image.id}
          className="absolute pointer-events-none"
          style={{
            left: image.position_x,
            top: image.position_y,
            zIndex: image.z_index || 1
          }}
        >
          <img
            src={image.image_url}
            alt="Footer decoration"
            className="max-w-20 max-h-20 object-contain opacity-80"
            style={{
              width: image.width || 'auto',
              height: image.height || 'auto'
            }}
          />
        </div>
      ))}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              {footerLogo ? (
                <div className="flex items-center space-x-2">
                  <img 
                    src={footerLogo.image_url} 
                    alt="Star Jump Logo" 
                    className="h-12 w-auto"
                  />
                </div>
              ) : (
                <>
                  <div className="flex items-center bg-white rounded-full p-2 shadow-lg">
                    <Star className="h-6 w-6 text-royal-blue mr-1" fill="currentColor" />
                    <span className="font-bold text-lg text-royal-blue">STAR</span>
                  </div>
                  <span className="font-bold text-xl accent-themed">JUMP</span>
                </>
              )}
            </Link>
            <p className="text-themed opacity-90 text-sm leading-relaxed mb-4">
              Kenya's leading provider of fun stations and children's play areas for private and corporate events. Bringing joy to every celebration!
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-3">
              <a href="#" className="bg-white/10 hover:bg-white hover:text-royal-blue p-2 rounded-full transition-all duration-300">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-white hover:text-royal-blue p-2 rounded-full transition-all duration-300">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-white hover:text-royal-blue p-2 rounded-full transition-all duration-300">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://wa.me/254700000000" className="bg-green-500 hover:bg-green-600 p-2 rounded-full transition-all duration-300">
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 accent-themed">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-themed opacity-90 hover:accent-themed transition-colors duration-300">About Us</Link></li>
              <li><Link to="/corporate" className="text-themed opacity-90 hover:accent-themed transition-colors duration-300">Corporate Services</Link></li>
              <li><Link to="/events" className="text-themed opacity-90 hover:accent-themed transition-colors duration-300">Events</Link></li>
              <li><Link to="/shop" className="text-themed opacity-90 hover:accent-themed transition-colors duration-300">Shop</Link></li>
              <li><Link to="/blog" className="text-themed opacity-90 hover:accent-themed transition-colors duration-300">Blog</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4 accent-themed">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 accent-themed" />
                <span className="text-themed opacity-90 text-sm">+254 700 000 000</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 accent-themed" />
                <span className="text-themed opacity-90 text-sm">info@starjump.co.ke</span>
              </div>
              <div className="flex items-start space-x-2">
                <Clock className="h-4 w-4 accent-themed mt-1" />
                <div className="text-themed opacity-90 text-sm">
                  <div>Mon - Fri: 8:00 AM - 6:00 PM</div>
                  <div>Sat - Sun: 9:00 AM - 5:00 PM</div>
                </div>
              </div>
            </div>
          </div>

          {/* Locations */}
          <div>
            <h3 className="font-bold text-lg mb-4 accent-themed">Our Locations</h3>
            <div className="space-y-2">
              {locations.map((location, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 accent-themed mt-1 flex-shrink-0" />
                  <span className="text-themed opacity-90 text-sm">{location}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-themed/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-themed opacity-80 text-sm mb-4 md:mb-0">
            © 2024 Star Jump Kenya. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm">
            <Link to="/privacy-policy" className="text-white/80 hover:text-star-yellow transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link to="/terms-conditions" className="text-themed opacity-80 hover:accent-themed transition-colors duration-300">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;