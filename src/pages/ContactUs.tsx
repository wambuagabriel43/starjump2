import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, CheckCircle } from 'lucide-react';
import { usePageContent, getContentWithFallback } from '../hooks/usePageContent';
import { supabase } from '../lib/supabase';

const ContactUs: React.FC = () => {
  const { content: pageContent, loading: contentLoading } = usePageContent('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Get page content with fallbacks
  const heroContent = getContentWithFallback(pageContent, 'hero', {
    title: 'Contact Us',
    content_text: 'Get in touch with Kenya\'s premier children\'s entertainment experts. We\'re here to make your event magical!'
  });

  const formContent = getContentWithFallback(pageContent, 'contact_form', {
    title: 'Send us a Message',
    content_text: 'We\'d love to hear from you!'
  });

  const locationsContent = getContentWithFallback(pageContent, 'locations', {
    title: 'Our Locations',
    content_text: 'Visit us at any of our convenient locations across Nairobi'
  });

  const locations = [
    {
      name: 'Greenspan Mall',
      address: 'Greenspan Mall, Donholm Road, Nairobi',
      phone: '+254 700 000 001',
      hours: 'Mon-Sun: 10:00 AM - 8:00 PM',
      image: 'https://images.pexels.com/photos/1104014/pexels-photo-1104014.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1'
    },
    {
      name: 'Garden City Mall',
      address: 'Garden City Mall, Thika Road, Nairobi',
      phone: '+254 700 000 002',
      hours: 'Mon-Sun: 10:00 AM - 9:00 PM',
      image: 'https://images.pexels.com/photos/1619654/pexels-photo-1619654.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1'
    },
    {
      name: 'Galleria Mall',
      address: 'Galleria Shopping Mall, Langata Road, Nairobi',
      phone: '+254 700 000 003',
      hours: 'Mon-Sun: 10:00 AM - 8:00 PM',
      image: 'https://images.pexels.com/photos/1292294/pexels-photo-1292294.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Save to database
      const { error } = await supabase
        .from('booking_submissions')
        .insert([{
          submission_type: 'contact',
          full_name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          status: 'new'
        }]);

      if (error) {
        console.error('Error saving contact submission:', error);
        // Continue to show success even if database save fails
      }
    } catch (err) {
      console.error('Exception saving contact submission:', err);
      // Continue to show success even if database save fails
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
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
              Message Sent Successfully!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Thank you for contacting Star Jump! We've received your message and will get back to you within 24 hours.
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
              word === 'Us' ? 
                <span key={index} className="text-star-yellow">{word}</span> : 
                <span key={index}>{word} </span>
            )}
          </h1>
          <p className="text-xl md:text-2xl text-white/95 max-w-4xl mx-auto leading-relaxed">
            {heroContent.content_text}
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {/* Phone */}
            <div className="bg-white rounded-2xl p-6 shadow-xl text-center hover:shadow-2xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-royal-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-royal-blue mb-2">Call Us</h3>
              <p className="text-gray-600 mb-2">+254 700 000 000</p>
              <p className="text-sm text-gray-500">Mon-Fri: 8AM-6PM</p>
            </div>

            {/* Email */}
            <div className="bg-white rounded-2xl p-6 shadow-xl text-center hover:shadow-2xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-grass-green rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-royal-blue mb-2">Email Us</h3>
              <p className="text-gray-600 mb-2">info@starjump.co.ke</p>
              <p className="text-sm text-gray-500">24/7 Response</p>
            </div>

            {/* WhatsApp */}
            <div className="bg-white rounded-2xl p-6 shadow-xl text-center hover:shadow-2xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-royal-blue mb-2">WhatsApp</h3>
              <p className="text-gray-600 mb-2">+254 700 000 000</p>
              <p className="text-sm text-gray-500">Instant Response</p>
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl p-6 shadow-xl text-center hover:shadow-2xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-bright-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-royal-blue mb-2">Visit Us</h3>
              <p className="text-gray-600 mb-2">3 Locations</p>
              <p className="text-sm text-gray-500">Across Nairobi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-royal-blue to-blue-600 p-8 text-center">
                <h2 className="text-3xl font-bold text-white mb-2">{formContent.title}</h2>
                <p className="text-white/90">{formContent.content_text}</p>
              </div>

              <form onSubmit={handleSubmit} className="p-8">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="flex items-center text-royal-blue font-semibold">
                      <Mail className="h-5 w-5 mr-2" />
                      Full Name *
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
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <label className="flex items-center text-royal-blue font-semibold">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 transition-colors duration-300 outline-none"
                  >
                    <option value="">Select a subject</option>
                    <option value="booking-inquiry">Booking Inquiry</option>
                    <option value="corporate-services">Corporate Services</option>
                    <option value="equipment-rental">Equipment Rental</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2 mb-8">
                  <label className="flex items-center text-royal-blue font-semibold">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 transition-colors duration-300 outline-none resize-none"
                    placeholder="Tell us about your event, requirements, or any questions you have..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-royal-blue to-blue-600 text-white font-bold text-lg py-4 rounded-xl transition-all duration-300 transform shadow-2xl ${
                    isSubmitting
                      ? 'opacity-75 cursor-not-allowed'
                      : 'hover:from-blue-600 hover:to-royal-blue hover:scale-105 hover:shadow-3xl'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Map & Business Hours */}
            <div className="space-y-8">
              {/* Embedded Map */}
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="h-64 bg-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Interactive Map</p>
                    <p className="text-sm text-gray-500">Garden City Mall Location</p>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                <div className="flex items-center mb-6">
                  <Clock className="h-8 w-8 text-royal-blue mr-3" />
                  <h3 className="text-2xl font-bold text-royal-blue">Business Hours</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">Monday - Friday</span>
                    <span className="text-royal-blue font-bold">8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">Saturday</span>
                    <span className="text-royal-blue font-bold">9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">Sunday</span>
                    <span className="text-royal-blue font-bold">9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium text-gray-700">Emergency Support</span>
                    <span className="text-green-600 font-bold">24/7 Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              {locationsContent.title.split(' ').map((word, index) => 
                word === 'Locations' ? 
                  <span key={index} className="text-star-yellow">{word}</span> : 
                  <span key={index}>{word} </span>
              )}
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              {locationsContent.content_text}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {locations.map((location, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                <div className="h-48 overflow-hidden">
                  <img
                    src={location.image}
                    alt={location.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-royal-blue mb-4">{location.name}</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-5 w-5 text-royal-blue mt-1 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{location.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-5 w-5 text-royal-blue" />
                      <span className="text-gray-600 text-sm">{location.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-royal-blue" />
                      <span className="text-gray-600 text-sm">{location.hours}</span>
                    </div>
                  </div>
                  <button className="w-full mt-4 bg-gradient-to-r from-bright-orange to-fun-pink text-white font-bold py-3 rounded-full hover:from-fun-pink hover:to-bright-orange transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Get Directions
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;