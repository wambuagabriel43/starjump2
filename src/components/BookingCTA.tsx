import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Phone, MapPin, Sparkles } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const BookingCTA: React.FC = () => {
  const { content } = useContent();
  const { bookingCTA } = content;

  const iconMap = {
    'Flexible Booking': Calendar,
    'Full Setup Service': MapPin,
    '24/7 Support': Phone
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-20 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute top-20 right-20 w-24 h-16 bg-star-yellow/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-10 left-1/4 w-28 h-18 bg-fun-pink/15 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl overflow-hidden">
          <div className="relative">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-bright-orange to-fun-pink p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                    <Sparkles className="h-8 w-8 text-white animate-pulse" />
                  </div>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                  {bookingCTA.title}
                </h2>
                <p className="text-xl md:text-2xl text-white/95 font-medium max-w-3xl mx-auto leading-relaxed">
                  {bookingCTA.description}
                </p>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Left side - Features */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-royal-blue mb-6">
                    What's Included:
                  </h3>
                  
                  <div className="space-y-4">
                    {bookingCTA.features.map((feature, index) => {
                      const IconComponent = iconMap[feature.title] || Calendar;
                      return (
                        <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-300">
                          <div className="flex-shrink-0 w-12 h-12 bg-royal-blue rounded-full flex items-center justify-center text-white">
                            <IconComponent className="h-6 w-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-royal-blue text-lg">{feature.title}</h4>
                            <p className="text-gray-600 mt-1">{feature.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right side - CTA */}
                <div className="text-center">
                  <div className="bg-gradient-to-br from-royal-blue to-blue-600 rounded-3xl p-8 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold mb-4">Ready to Book?</h3>
                      <p className="text-lg opacity-90 mb-8 leading-relaxed">
                        Fill out our quick booking form and we'll get back to you within 2 hours 
                        with a personalized quote and availability confirmation.
                      </p>
                      
                      <Link
                        to="/booking"
                        className="inline-block bg-gradient-to-r from-star-yellow to-bright-orange text-royal-blue font-bold text-xl px-12 py-4 rounded-full hover:from-bright-orange hover:to-star-yellow transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl"
                      >
                        Book Now
                      </Link>
                      
                      <div className="mt-6 pt-6 border-t border-white/20">
                        <p className="text-sm opacity-80">
                          Questions? Call us at{' '}
                          <span className="font-bold text-star-yellow">(555) 123-JUMP</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingCTA;