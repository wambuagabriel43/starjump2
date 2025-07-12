import React from 'react';
import { Star, Heart, Users, Award, Target, Eye } from 'lucide-react';

const AboutUs: React.FC = () => {
  const teamMembers = [
    {
      name: 'Sarah Wanjiku',
      role: 'Founder & CEO',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
      description: 'Passionate about creating magical experiences for children across Kenya.'
    },
    {
      name: 'David Kimani',
      role: 'Operations Manager',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
      description: 'Ensures every event runs smoothly with our premium equipment and service.'
    },
    {
      name: 'Grace Achieng',
      role: 'Creative Director',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
      description: 'Designs unique play experiences that spark imagination and joy.'
    }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Child Safety First',
      description: 'Every piece of equipment is regularly inspected and meets international safety standards.',
      color: 'bg-red-500'
    },
    {
      icon: Star,
      title: 'Quality Excellence',
      description: 'We use only premium, durable equipment that provides the best play experience.',
      color: 'bg-star-yellow'
    },
    {
      icon: Users,
      title: 'Community Focus',
      description: 'Supporting Kenyan families and businesses with memorable celebration solutions.',
      color: 'bg-grass-green'
    },
    {
      icon: Award,
      title: 'Professional Service',
      description: 'Our trained team ensures seamless setup, supervision, and cleanup for every event.',
      color: 'bg-bright-orange'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-20 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute top-20 right-20 w-24 h-16 bg-star-yellow/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-10 left-1/4 w-28 h-18 bg-fun-pink/15 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-lg">
            About <span className="text-star-yellow">Star Jump</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/95 max-w-4xl mx-auto leading-relaxed">
            Kenya's premier provider of fun stations and children's play areas, bringing joy and excitement to every celebration since 2018.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1104014/pexels-photo-1104014.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1"
                alt="Children playing on colorful playground equipment"
                className="w-full h-80 lg:h-96 object-cover rounded-3xl shadow-2xl"
              />
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-star-yellow rounded-full opacity-80 animate-bounce-slow"></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-fun-pink rounded-full opacity-70 animate-float"></div>
            </div>

            <div className="lg:pl-8">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Our <span className="text-star-yellow">Story</span>
              </h2>
              <div className="space-y-4 text-lg text-white/90 leading-relaxed">
                <p>
                  Star Jump was born from a simple belief: every child deserves to experience pure joy and wonder. Founded in Nairobi in 2018, we started with a single bouncy castle and a dream to make celebrations unforgettable.
                </p>
                <p>
                  Today, we're proud to serve families, schools, malls, and corporations across Kenya with our premium collection of play equipment and professional event services. From intimate birthday parties to large corporate events, we bring the magic of play to every occasion.
                </p>
                <p>
                  Our commitment to safety, quality, and exceptional service has made us Kenya's trusted partner for creating memories that last a lifetime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center mb-6">
                <div className="bg-royal-blue rounded-full p-3 mr-4">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-royal-blue">Our Mission</h3>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                To create magical play experiences that bring families and communities together, while providing safe, high-quality entertainment solutions that spark joy and imagination in children across Kenya.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-gradient-to-br from-star-yellow to-bright-orange rounded-3xl p-8 shadow-2xl text-white">
              <div className="flex items-center mb-6">
                <div className="bg-white/20 rounded-full p-3 mr-4">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold">Our Vision</h3>
              </div>
              <p className="text-white/95 text-lg leading-relaxed">
                To be East Africa's leading provider of children's entertainment solutions, setting the standard for safety, innovation, and service excellence in the play equipment industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              Our <span className="text-star-yellow">Values</span>
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              The principles that guide everything we do at Star Jump
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                  <div className={`${value.color} rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4 mx-auto`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-royal-blue mb-3 text-center">{value.title}</h3>
                  <p className="text-gray-600 text-center leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              Meet Our <span className="text-star-yellow">Team</span>
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              The passionate people behind Kenya's favorite play experience provider
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                <div className="h-64 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-royal-blue mb-2">{member.name}</h3>
                  <p className="text-bright-orange font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-600 leading-relaxed">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl font-bold text-royal-blue mb-6">
              Ready to Create Magic?
            </h2>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Let's work together to make your next event unforgettable. Contact us today for a personalized quote!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/booking"
                className="bg-gradient-to-r from-royal-blue to-blue-600 text-white font-bold text-lg px-8 py-4 rounded-full hover:from-blue-600 hover:to-royal-blue transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Book Now
              </a>
              <a
                href="/contact"
                className="bg-gradient-to-r from-star-yellow to-bright-orange text-royal-blue font-bold text-lg px-8 py-4 rounded-full hover:from-bright-orange hover:to-star-yellow transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;