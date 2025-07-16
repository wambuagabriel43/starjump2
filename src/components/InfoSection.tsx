import React from 'react';
import { Shield, Heart, Star, Users } from 'lucide-react';
import { useInfoSection } from '../hooks/useSupabaseData';

const InfoSection: React.FC = () => {
  const { infoSection, loading, error } = useInfoSection('homepage-about');

  // Default benefits if no data from Supabase
  const defaultBenefits = [
    'Safety certified equipment with regular inspections',
    'Creating magical memories for children and families',
    'Premium quality inflatables and entertainment',
    'Professional setup and supervision included'
  ];

  const iconMap = {
    'Safety certified equipment with regular inspections': Shield,
    'Creating magical memories for children and families': Heart,
    'Premium quality inflatables and entertainment': Star,
    'Professional setup and supervision included': Users
  };

  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </section>
    );
  }

  // Use default content if no Supabase data
const content = infoSection || {
  title: 'Why Choose Star Jump?',
  subtitle: '',
  content_text: 'Star Jump is the leading play and fitness equipment supplier for outdoor and indoor equipment for educational, commercial, and residential use in East Africa.\n\nStar Jump offers a comprehensive range of children\'s indoor and outdoor play equipment for all ages. At Star Jump, we understand the importance of play, and we are certain you will find solutions that suit your needs and budget.',
  image_url: 'https://images.pexels.com/photos/1104014/pexels-photo-1104014.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
  layout: 'right-image' as const
};


  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className={`grid lg:grid-cols-2 gap-12 items-center ${
          content.layout === 'left-image' ? '' : 'lg:grid-flow-col-dense'
        }`}>
          {/* Image */}
          <div className={`relative ${content.layout === 'left-image' ? 'lg:order-1' : 'lg:order-2'}`}>
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <img
                src={content.image_url}
                alt={content.title}
                className="w-full h-80 lg:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-royal-blue/20 to-transparent"></div>
            </div>
            
            {/* Floating decorative elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-star-yellow rounded-full opacity-80 animate-bounce-slow"></div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-fun-pink rounded-full opacity-70 animate-float"></div>
          </div>

          {/* Content */}
          <div className={`lg:pl-8 ${content.layout === 'left-image' ? 'lg:order-2' : 'lg:order-1'}`}>
            <div className="mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {content.title}
                {content.subtitle && (
                  <span className="text-star-yellow block">{content.subtitle}</span>
                )}
              </h2>
              <p className="text-lg text-white opacity-90 leading-relaxed">
                {content.content_text}
              </p>
            </div>

            {/* Benefits List */}
            <div className="space-y-4">
              {defaultBenefits.map((benefit, index) => {
                const IconComponent = iconMap[benefit] || Star;
                return (
                  <div
                    key={index}
                    className="flex items-start space-x-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/20 transition-all duration-300"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-star-yellow rounded-full flex items-center justify-center text-royal-blue">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <p className="text-white font-medium pt-3 leading-relaxed">
                      {benefit}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold text-star-yellow mb-1">500+</div>
                <div className="text-sm text-white opacity-80">Happy Events</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-star-yellow mb-1">10+</div>
                <div className="text-sm text-white opacity-80">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-star-yellow mb-1">24/7</div>
                <div className="text-sm text-white opacity-80">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;