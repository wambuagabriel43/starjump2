import React from 'react';
import { Star, Heart, Users, Award, Target, Eye } from 'lucide-react';
import { usePageContent, getContentWithFallback } from '../hooks/usePageContent';

const AboutUs: React.FC = () => {
  const { content: pageContent, loading, error } = usePageContent('about');
  
  // Get all content sections with fallbacks
  const hero = getContentWithFallback(pageContent, 'hero', {
    title: 'About Star Jump',
    content_text: 'Kenya\'s premier provider of fun stations and children\'s play areas, bringing joy and excitement to every celebration since 2018.'
  });

  const story = getContentWithFallback(pageContent, 'story', {
    title: 'Our Story',
    content_text: 'Star Jump installs and manages Outdoor and Indoor Fun Stations in busy Shopping Malls. Our innovative Play Areas cater to toddlers and children aged between 2-16yrs.Our Play Areas are equipped with fun and safe recreational indoor and outdoor equipment supervised by qualified staff who undergo continuous training in Child Care and Safety.These unique Indoor and Outdoor playgrounds are popular and growing demand has necessitated us to retail and install playgrounds in homes, learning institutions, shopping malls and hospitals.We also offer other fun activities and services such as Kiddie Rides, Bouncy Castles, Slides, Electric Bumper Cars, Video Games, Sports, Water Games, Bungee Trampolines, Climbing Frames and much more..',
    image_url: 'https://images.pexels.com/photos/1104014/pexels-photo-1104014.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
    metadata: {
      layout: 'right-image'
    }
  });

  const mission = getContentWithFallback(pageContent, 'mission', {
    title: 'Our Mission',
    content_text: 'To create magical play experiences that bring families and communities together, while providing safe, high-quality entertainment solutions that spark joy and imagination in children across Kenya.',
    metadata: { type: 'mission', icon: 'Target' }
  });

  const vision = getContentWithFallback(pageContent, 'vision', {
    title: 'Our Vision',
    content_text: 'To be East Africa\'s leading provider of children\'s entertainment solutions, setting the standard for safety, innovation, and service excellence in the play equipment industry.',
    metadata: { type: 'vision', icon: 'Eye' }
  });

  const values = getContentWithFallback(pageContent, 'values', {
    title: 'Our Values',
    subtitle: 'The principles that guide everything we do at Star Jump',
    metadata: {
      values: [
        { title: 'Child Safety First', description: 'Every piece of equipment is regularly inspected and meets international safety standards.', icon: 'Heart', color: 'bg-red-500' },
        { title: 'Quality Excellence', description: 'We use only premium, durable equipment that provides the best play experience.', icon: 'Star', color: 'bg-star-yellow' },
        { title: 'Community Focus', description: 'Supporting Kenyan families and businesses with memorable celebration solutions.', icon: 'Users', color: 'bg-grass-green' },
        { title: 'Professional Service', description: 'Our trained team ensures seamless setup, supervision, and cleanup for every event.', icon: 'Award', color: 'bg-bright-orange' }
      ]
    }
  });

  const team = getContentWithFallback(pageContent, 'team', {
    title: 'Meet Our Team',
    subtitle: 'The passionate people behind Kenya\'s favorite play experience provider',
    metadata: {
      members: [
        { name: 'Sarah Wanjiku', role: 'Founder & CEO', image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1', description: 'Passionate about creating magical experiences for children across Kenya.' },
        { name: 'David Kimani', role: 'Operations Manager', image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1', description: 'Ensures every event runs smoothly with our premium equipment and service.' },
        { name: 'Grace Achieng', role: 'Creative Director', image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1', description: 'Designs unique play experiences that spark imagination and joy.' }
      ]
    }
  });

  const cta = getContentWithFallback(pageContent, 'cta', {
    title: 'Ready to Create Magic?',
    content_text: 'Let\'s work together to make your next event unforgettable. Contact us today for a personalized quote!',
    metadata: {
      buttons: [
        { text: 'Book Now', link: '/booking' },
        { text: 'Contact Us', link: '/contact' }
      ]
    }
  });

  // Debug logging
  React.useEffect(() => {
    console.log('[AboutUs] Page content loaded:', pageContent.length, 'items');
    if (error) console.error('[AboutUs] Error:', error);
    if (loading) console.log('[AboutUs] Loading...');
  }, [pageContent, loading, error]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-royal-blue via-blue-600 to-purple-700"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-star-yellow/20 rounded-full animate-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-fun-pink/20 rounded-full animate-bounce-slow"></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-grass-green/20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-bright-orange/20 rounded-full animate-float"></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-lg">
            {hero.title.split(' ').map((word, index) => 
              word === 'Star' || word === 'Jump' ? 
                <span key={index} className="text-star-yellow">{word} </span> : 
                <span key={index}>{word} </span>
            )}
          </h1>
          <p className="text-xl md:text-2xl text-white/95 max-w-4xl mx-auto leading-relaxed">
            {hero.content_text}
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-royal-blue via-blue-600 to-purple-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <img
                  src={story.image_url || 'https://images.pexels.com/photos/1104014/pexels-photo-1104014.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1'}
                  alt={story.title}
                  className="w-full h-80 lg:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-royal-blue/20 to-transparent"></div>
              </div>
              
              {/* Floating decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-star-yellow rounded-full opacity-80 animate-bounce-slow"></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-fun-pink rounded-full opacity-70 animate-float"></div>
            </div>

            {/* Content */}
            <div className="lg:pl-8">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {story.title.split(' ').map((word, index) => 
                  word === 'Story' ? 
                    <span key={index} className="text-star-yellow">{word}</span> : 
                    <span key={index}>{word} </span>
                )}
              </h2>
              <div className="text-lg text-white/90 leading-relaxed">
                {story.content_text.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <div className="flex items-center mb-6">
                <div className="bg-royal-blue rounded-full p-3 mr-4">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-royal-blue">{mission.title}</h3>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                {mission.content_text}
              </p>
            </div>

            {/* Vision */}
            <div className="bg-gradient-to-br from-royal-blue to-blue-600 rounded-3xl p-8 shadow-xl text-white">
              <div className="flex items-center mb-6">
                <div className="bg-white/20 rounded-full p-3 mr-4">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold">{vision.title}</h3>
              </div>
              <p className="text-white/95 text-lg leading-relaxed">
                {vision.content_text}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-royal-blue via-blue-600 to-purple-700">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              {values.title.split(' ').map((word, index) => 
                word === 'Values' ? 
                  <span key={index} className="text-star-yellow">{word}</span> : 
                  <span key={index}>{word} </span>
              )}
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              {values.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.metadata?.values?.map((value, index) => {
              const iconMap = { Heart, Star, Users, Award };
              const Icon = iconMap[value.icon] || Star;
              return (
                <div key={index} className="bg-white rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                  <div className={`${value.color} rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4 mx-auto`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-royal-blue mb-3 text-center">{value.title}</h4>
                  <p className="text-gray-700 text-center leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-royal-blue via-blue-600 to-purple-700">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              {team.title.split(' ').map((word, index) => 
                word === 'Team' ? 
                  <span key={index} className="text-star-yellow">{word}</span> : 
                  <span key={index}>{word} </span>
              )}
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              {team.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.metadata?.members?.map((member, index) => (
              <div key={index} className="bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                <div className="h-64 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-royal-blue mb-2">{member.name}</h4>
                  <p className="text-star-yellow font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-700 leading-relaxed">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-royal-blue via-blue-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl font-bold text-royal-blue mb-6">
              {cta.title}
            </h2>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              {cta.content_text}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {cta.metadata?.buttons?.map((button, index) => (
                <a
                  key={index}
                  href={button.link}
                  className={`font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg ${
                    index === 0 
                      ? 'bg-gradient-to-r from-royal-blue to-blue-600 text-white hover:from-blue-600 hover:to-royal-blue'
                      : 'bg-gradient-to-r from-star-yellow to-bright-orange text-royal-blue hover:from-bright-orange hover:to-star-yellow'
                  }`}
                >
                  {button.text}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;