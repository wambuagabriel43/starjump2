import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { useEvents } from '../hooks/useSupabaseData';

const UpcomingEvents: React.FC = () => {
  const { events, loading, error } = useEvents();

  if (loading) {
    return (
      <section id="events" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading events...</p>
        </div>
      </section>
    );
  }

  if (error || events.length === 0) {
    return (
      <section id="events" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Upcoming Events
          </h2>
          <p className="text-white/90">No events scheduled at the moment. Check back soon!</p>
        </div>
      </section>
    );
  }

  // Show only featured events or first 3 events
  const displayEvents = events.filter(event => event.featured).slice(0, 3);

  return (
    <section id="events" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Upcoming Events
          </h2>
          <div className="w-24 h-1 bg-star-yellow mx-auto rounded-full"></div>
          <p className="text-xl text-white mt-4 opacity-90">
            Don't miss out on our exciting events and activities!
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-3xl"
            >
              {/* Event Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-star-yellow text-royal-blue px-3 py-1 rounded-full font-bold text-sm">
                  {event.category}
                </div>
              </div>

              {/* Event Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-royal-blue mb-3">
                  {event.title}
                </h3>

                {/* Event Details */}
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

                {/* CTA Button */}
                <button className="w-full bg-gradient-to-r from-bright-orange to-fun-pink text-white font-bold py-3 px-6 rounded-full hover:from-fun-pink hover:to-bright-orange transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;