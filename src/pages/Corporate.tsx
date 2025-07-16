import React, { useState } from 'react';
import { Building2, Users, Calendar, Award, CheckCircle, Send, MapPin, Phone, Mail } from 'lucide-react';
import { usePageContent, getContentWithFallback } from '../hooks/usePageContent';

const Corporate: React.FC = () => {
  const { content: pageContent, loading: contentLoading } = usePageContent('corporate');
  const [formData, setFormData] = useState({
    name: '',
    institution: '',
    email: '',
    phone: '',
    eventType: '',
    preferredDates: '',
    customRequirements: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Get page content with fallbacks
  const heroContent = getContentWithFallback(pageContent, 'hero', {
    title: 'Corporate Solutions',
    content_text: 'Transform your institution with premium play solutions. From permanent installations to event rentals, we create engaging experiences for your community.'
  });

  const servicesContent = getContentWithFallback(pageContent, 'services', {
    title: 'Our Services',
    content_text: 'Comprehensive play solutions tailored for institutions and corporate clients'
  });

  const clientsContent = getContentWithFallback(pageContent, 'clients', {
    title: 'Who We Serve',
    content_text: 'Trusted by leading institutions across Kenya'
  });

  const ctaContent = getContentWithFallback(pageContent, 'cta', {
    title: 'Let\'s Build a Play Space Together!',
    content_text: 'Tell us about your institution and requirements'
  });

  const services = [
    {
      icon: Building2,
      title: 'Permanent Installations',
      description: 'Custom-designed play areas for malls, hospitals, schools, and residential complexes.',
      features: ['Custom design consultation', 'Professional installation', 'Ongoing maintenance', 'Safety compliance'],
      color: 'bg-royal-blue'
    },
    {
      icon: Calendar,
      title: 'Event Rentals',
      description: 'Premium equipment rentals for corporate events, school functions, and institutional celebrations.',
      features: ['Full setup & breakdown', 'Professional supervision', 'Insurance coverage', 'Flexible packages'],
      color: 'bg-grass-green'
    },
    {
      icon: Users,
      title: 'Team Building',
      description: 'Engaging team-building activities and corporate family day solutions.',
      features: ['Interactive games', 'Team challenges', 'Family-friendly activities', 'Professional facilitation'],
      color: 'bg-bright-orange'
    }
  ];

  const clientTypes = [
    { name: 'Shopping Malls', icon: '🏬', description: 'Permanent play areas and seasonal events' },
    { name: 'Schools & Universities', icon: '🏫', description: 'Sports days, graduation events, open days' },
    { name: 'Hospitals & Clinics', icon: '🏥', description: 'Children\'s waiting areas and wellness events' },
    { name: 'Corporate Offices', icon: '🏢', description: 'Family days, team building, celebrations' },
    { name: 'Residential Complexes', icon: '🏘️', description: 'Community events and permanent installations' },
    { name: 'Hotels & Resorts', icon: '🏨', description: 'Guest entertainment and special events' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-royal-blue mb-4">
              Corporate Inquiry Received!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Thank you for your interest in Star Jump's corporate services. Our team will contact you within 24 hours to discuss your requirements and provide a customized proposal.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-gradient-to-r from-royal-blue to-blue-600 text-white font-bold py-3 px-8 rounded-full hover:from-blue-600 hover:to-royal-blue transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Return Home
            </button>
          </div>
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
            {heroContent.title.split(' ').map((word, index) => 
              word === 'Solutions' ? 
                <span key={index} className="text-star-yellow">{word}</span> : 
                <span key={index}>{word} </span>
            )}
          </h1>
          <p className="text-xl md:text-2xl text-white/95 max-w-4xl mx-auto leading-relaxed mb-8">
            {heroContent.content_text}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact-form"
              className="bg-gradient-to-r from-star-yellow to-bright-orange text-royal-blue font-bold text-lg px-8 py-4 rounded-full hover:from-bright-orange hover:to-star-yellow transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Get Custom Quote
            </a>
            <a
              href="#services"
              className="bg-white/10 backdrop-blur-sm text-white font-bold text-lg px-8 py-4 rounded-full hover:bg-white hover:text-royal-blue transition-all duration-300 transform hover:scale-105 border border-white/20"
            >
              View Services
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              {servicesContent.title.split(' ').map((word, index) => 
                word === 'Services' ? 
                  <span key={index} className="text-star-yellow">{word}</span> : 
                  <span key={index}>{word} </span>
              )}
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              {servicesContent.content_text}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                  <div className={`${service.color} rounded-full p-4 w-16 h-16 flex items-center justify-center mb-6`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-royal-blue mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-grass-green" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Client Types */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              {clientsContent.title.split(' ').map((word, index) => 
                word === 'Serve' ? 
                  <span key={index} className="text-star-yellow">{word}</span> : 
                  <span key={index}>{word} </span>
              )}
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              {clientsContent.content_text}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clientTypes.map((client, index) => (
              <div key={index} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="text-4xl mb-4 text-center">{client.icon}</div>
                <h3 className="text-xl font-bold text-royal-blue mb-2 text-center">{client.name}</h3>
                <p className="text-gray-600 text-center">{client.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-royal-blue to-blue-600 p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-2">{ctaContent.title}</h2>
              <p className="text-white/90">{ctaContent.content_text}</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center text-royal-blue font-semibold">
                    <Users className="h-5 w-5 mr-2" />
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 transition-colors duration-300 outline-none"
                    placeholder="Your full name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-royal-blue font-semibold">
                    <Building2 className="h-5 w-5 mr-2" />
                    Institution Name *
                  </label>
                  <input
                    type="text"
                    name="institution"
                    required
                    value={formData.institution}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 transition-colors duration-300 outline-none"
                    placeholder="Company/Institution name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-royal-blue font-semibold">
                    <Mail className="h-5 w-5 mr-2" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 transition-colors duration-300 outline-none"
                    placeholder="your.email@company.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-royal-blue font-semibold">
                    <Phone className="h-5 w-5 mr-2" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 transition-colors duration-300 outline-none"
                    placeholder="+254 700 000 000"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-royal-blue font-semibold">
                    <Calendar className="h-5 w-5 mr-2" />
                    Type of Event/Installation *
                  </label>
                  <select
                    name="eventType"
                    required
                    value={formData.eventType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 transition-colors duration-300 outline-none"
                  >
                    <option value="">Select type</option>
                    <option value="permanent-installation">Permanent Installation</option>
                    <option value="corporate-event">Corporate Event</option>
                    <option value="school-function">School Function</option>
                    <option value="mall-event">Mall Event</option>
                    <option value="team-building">Team Building</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-royal-blue font-semibold">
                    <Calendar className="h-5 w-5 mr-2" />
                    Preferred Dates
                  </label>
                  <input
                    type="text"
                    name="preferredDates"
                    value={formData.preferredDates}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 transition-colors duration-300 outline-none"
                    placeholder="e.g., March 2024 or specific dates"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="flex items-center text-royal-blue font-semibold">
                    <MapPin className="h-5 w-5 mr-2" />
                    Custom Requirements
                  </label>
                  <textarea
                    name="customRequirements"
                    rows={4}
                    value={formData.customRequirements}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 transition-colors duration-300 outline-none resize-none"
                    placeholder="Tell us about your space, target age groups, specific requirements, budget range, etc."
                  />
                </div>
              </div>

              <div className="mt-8 text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex items-center space-x-3 bg-gradient-to-r from-royal-blue to-blue-600 text-white font-bold text-lg px-12 py-4 rounded-full transition-all duration-300 transform shadow-2xl ${
                    isSubmitting
                      ? 'opacity-75 cursor-not-allowed'
                      : 'hover:from-blue-600 hover:to-royal-blue hover:scale-105 hover:shadow-3xl'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Get Custom Proposal</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Corporate;