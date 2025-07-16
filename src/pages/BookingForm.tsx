import React, { useState } from 'react';
import { Calendar, User, Phone, Mail, MapPin, FileText, Send, Star, Users } from 'lucide-react';
import { usePageContent, getContentWithFallback } from '../hooks/usePageContent';

interface FormData {
  fullName: string;
  contactNumber: string;
  email: string;
  bookingDate: string;
  location: string;
  eventType: string;
  numberOfChildren: string;
  customNeeds: string;
}

const BookingForm: React.FC = () => {
  const { content: pageContent, loading: contentLoading } = usePageContent('booking');
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    contactNumber: '',
    email: '',
    bookingDate: '',
    location: '',
    eventType: '',
    numberOfChildren: '',
    customNeeds: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Get page content with fallbacks
  const heroContent = getContentWithFallback(pageContent, 'hero', {
    title: 'Book Your Fun Space',
    content_text: 'Fill out the form below and we\'ll get back to you with availability and pricing in KES!'
  });

  const formContent = getContentWithFallback(pageContent, 'booking_form', {
    title: 'Let\'s Make Your Event Amazing!',
    content_text: 'Tell us about your event and we\'ll handle the rest'
  });

  const eventTypes = [
    'Birthday Party',
    'Corporate Event',
    'School Function',
    'Wedding Reception',
    'Community Event',
    'Religious Celebration',
    'Graduation Party',
    'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
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
              <Star className="h-10 w-10 text-green-600 fill-current" />
            </div>
            <h1 className="text-3xl font-bold text-royal-blue mb-4">
              Booking Request Received!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Thank you for choosing Star Jump Kenya! We've received your booking request and will contact you within 2 hours with availability confirmation and pricing details in Kenyan Shillings (KES).
            </p>
            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-royal-blue mb-2">What happens next?</h3>
              <ul className="text-gray-600 text-sm space-y-1 text-left">
                <li>• Our team will review your request within 2 hours</li>
                <li>• We'll contact you to confirm availability and discuss details</li>
                <li>• You'll receive a detailed quote in KES with all costs</li>
                <li>• Once confirmed, we'll handle all setup and delivery</li>
              </ul>
            </div>
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
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            {heroContent.title}
          </h1>
          <div className="w-24 h-1 bg-star-yellow mx-auto rounded-full"></div>
          <p className="text-xl text-white mt-4 opacity-90 max-w-2xl mx-auto">
            {heroContent.content_text}
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-bright-orange to-fun-pink p-8 text-center">
            <h2 className="text-2xl font-bold text-white">{formContent.title}</h2>
            <p className="text-white/90 mt-2">{formContent.content_text}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Full Name */}
              <div className="space-y-2">
                <label htmlFor="fullName" className="flex items-center text-royal-blue font-semibold">
                  <User className="h-5 w-5 mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 transition-colors duration-300 outline-none"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Contact Number */}
              <div className="space-y-2">
                <label htmlFor="contactNumber" className="flex items-center text-royal-blue font-semibold">
                  <Phone className="h-5 w-5 mr-2" />
                  Contact Number *
                </label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  required
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 transition-colors duration-300 outline-none"
                  placeholder="+254 700 000 000"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="flex items-center text-royal-blue font-semibold">
                  <Mail className="h-5 w-5 mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 transition-colors duration-300 outline-none"
                  placeholder="your.email@example.com"
                />
              </div>

              {/* Booking Date */}
              <div className="space-y-2">
                <label htmlFor="bookingDate" className="flex items-center text-royal-blue font-semibold">
                  <Calendar className="h-5 w-5 mr-2" />
                  Desired Booking Date *
                </label>
                <input
                  type="date"
                  id="bookingDate"
                  name="bookingDate"
                  required
                  value={formData.bookingDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 transition-colors duration-300 outline-none"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Event Type */}
              <div className="space-y-2">
                <label htmlFor="eventType" className="flex items-center text-royal-blue font-semibold">
                  <Star className="h-5 w-5 mr-2" />
                  Type of Event *
                </label>
                <select
                  id="eventType"
                  name="eventType"
                  required
                  value={formData.eventType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 transition-colors duration-300 outline-none"
                >
                  <option value="">Select event type</option>
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Number of Children */}
              <div className="space-y-2">
                <label htmlFor="numberOfChildren" className="flex items-center text-royal-blue font-semibold">
                  <Users className="h-5 w-5 mr-2" />
                  Number of Children Expected *
                </label>
                <select
                  id="numberOfChildren"
                  name="numberOfChildren"
                  required
                  value={formData.numberOfChildren}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 transition-colors duration-300 outline-none"
                >
                  <option value="">Select number</option>
                  <option value="1-10">1-10 children</option>
                  <option value="11-20">11-20 children</option>
                  <option value="21-30">21-30 children</option>
                  <option value="31-50">31-50 children</option>
                  <option value="51-100">51-100 children</option>
                  <option value="100+">More than 100 children</option>
                </select>
              </div>

              {/* Location */}
              <div className="md:col-span-2 space-y-2">
                <label htmlFor="location" className="flex items-center text-royal-blue font-semibold">
                  <MapPin className="h-5 w-5 mr-2" />
                  Location of Event *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 transition-colors duration-300 outline-none"
                  placeholder="Event address or venue name (e.g., Westlands, Nairobi)"
                />
              </div>

              {/* Custom Needs */}
              <div className="md:col-span-2 space-y-2">
                <label htmlFor="customNeeds" className="flex items-center text-royal-blue font-semibold">
                  <FileText className="h-5 w-5 mr-2" />
                  Custom Needs & Special Requirements
                </label>
                <textarea
                  id="customNeeds"
                  name="customNeeds"
                  rows={4}
                  value={formData.customNeeds}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 transition-colors duration-300 outline-none resize-none"
                  placeholder="Tell us about specific equipment preferences, age ranges, theme requirements, setup constraints, or any other special needs for your event..."
                />
              </div>
            </div>

            {/* Submit Button */}
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
                    <span>Submit Booking Request</span>
                  </>
                )}
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
              <h3 className="font-bold text-royal-blue mb-2">What happens next?</h3>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• We'll review your request within 2 hours during business hours</li>
                <li>• Our team will contact you to confirm availability and discuss details</li>
                <li>• We'll provide a detailed quote in Kenyan Shillings (KES) with all costs</li>
                <li>• Once confirmed, we'll handle all the setup, delivery, and collection</li>
                <li>• Professional supervision included for safe, worry-free fun!</li>
              </ul>
              
              <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                <p className="text-royal-blue font-semibold text-sm">
                  🇰🇪 Proudly serving Kenya with premium play equipment and exceptional service since 2018!
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;