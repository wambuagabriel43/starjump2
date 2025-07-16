import React from 'react';
import { Calendar, MapPin, Clock, Users, Star } from 'lucide-react';
import { useEvents } from '../hooks/useSupabaseData';
import { usePageContent, getContentBySection } from '../hooks/usePageContent';

const Events: React.FC = () => {
  const { events, loading, error } = useEvents();
  const { content: pageContent, loading: contentLoading } = usePageContent('events');

  // Get page content sections
  const heroContent = getContentBySection(pageContent, 'hero');
  const featuredSectionContent = getContentBySection(pageContent, 'featured_section');
  const allEventsSectionContent = getContentBySection(pageContent, 'all_events_section');
  const ctaSectionContent = getContentBySection(pageContent, 'cta_section');

  if (loading || contentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading exciting events...</p>
        </div>
      </div>
    );
  }

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
            {heroContent?.title || 'Upcoming Events'}
          </h1>
          <p className="text-xl md:text-2xl text-white/95 max-w-4xl mx-auto leading-relaxed">
            {heroContent?.content_text || 'Join us at exciting events across Kenya! From festivals to corporate gatherings, experience the magic of Star Jump.'}
          </p>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              {featuredSectionContent?.title || 'Featured Events'}
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              {featuredSectionContent?.content_text || 'Don\'t miss these amazing upcoming events and celebrations'}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {featuredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-3xl"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-star-yellow text-royal-blue px-4 py-2 rounded-full font-bold text-sm">
                    {event.category}
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 text-royal-blue px-3 py-1 rounded-full font-bold text-sm">
                    {event.price_text}
                  </div>
                  <div className="absolute bottom-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm flex items-center">
                    <Star className="h-4 w-4 mr-1" fill="currentColor" />
                    Featured
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-royal-blue mb-4">
                    {event.title}
                  </h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-5 w-5 mr-3 text-royal-blue" />
                      <span className="font-medium">{event.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-5 w-5 mr-3 text-royal-blue" />
                      <span className="font-medium">{event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-3 text-royal-blue" />
                      <span className="font-medium">{event.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="h-5 w-5 mr-3 text-royal-blue" />
                      <span className="font-medium">{event.attendees} Expected</span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="flex space-x-4">
                    <button className="flex-1 bg-gradient-to-r from-royal-blue to-blue-600 text-white font-bold py-3 px-6 rounded-full hover:from-blue-600 hover:to-royal-blue transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                      Learn More
                    </button>
                    <button className="bg-gradient-to-r from-star-yellow to-bright-orange text-royal-blue font-bold py-3 px-6 rounded-full hover:from-bright-orange hover:to-star-yellow transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                      Register
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Events from Supabase */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              {allEventsSectionContent?.title || 'All Events'}
            </h2>
          </div>

          {error ? (
            <div className="text-center py-12">
              <p className="text-white/80 mb-4">Unable to load events from database</p>
              <p className="text-white/60 text-sm">{error}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-3xl"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-star-yellow text-royal-blue px-3 py-1 rounded-full font-bold text-sm">
                      {event.category}
                    </div>
                    {event.featured && (
                      <div className="absolute bottom-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm flex items-center">
                        <Star className="h-4 w-4 mr-1" fill="currentColor" />
                        Featured
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-royal-blue mb-3">
                      {event.title}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-royal-blue" />
                        <span className="text-sm font-medium">{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      {event.time && (
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-2 text-royal-blue" />
                          <span className="text-sm font-medium">{event.time}</span>
                        </div>
                      )}
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-royal-blue" />
                        <span className="text-sm font-medium">{event.location}</span>
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm mb-6 leading-relaxed">
                      {event.description}
                    </p>

                    <button className="w-full bg-gradient-to-r from-bright-orange to-fun-pink text-white font-bold py-3 px-6 rounded-full hover:from-fun-pink hover:to-bright-orange transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && events.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-2xl font-bold text-white mb-2">No events scheduled</h3>
              <p className="text-white/80">Check back soon for exciting upcoming events!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl font-bold text-royal-blue mb-6">
              {ctaSectionContent?.title || 'Want Star Jump at Your Event?'}
            </h2>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              {ctaSectionContent?.content_text || 'Planning an event? Let us bring the fun to you! Contact us for custom event solutions and equipment rentals.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/booking"
                className="bg-gradient-to-r from-royal-blue to-blue-600 text-white font-bold text-lg px-8 py-4 rounded-full hover:from-blue-600 hover:to-royal-blue transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Book Equipment
              </a>
              <a
                href="/corporate"
                className="bg-gradient-to-r from-star-yellow to-bright-orange text-royal-blue font-bold text-lg px-8 py-4 rounded-full hover:from-bright-orange hover:to-star-yellow transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Corporate Events
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;