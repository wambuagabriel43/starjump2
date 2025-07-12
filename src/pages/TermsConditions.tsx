import React from 'react';
import { FileText, AlertTriangle, Shield, CreditCard } from 'lucide-react';

const TermsConditions: React.FC = () => {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FileText className="h-10 w-10 text-royal-blue" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Terms & Conditions
          </h1>
          <p className="text-xl text-white/90">
            Terms of service for Star Jump Kenya equipment rental and event services
          </p>
          <p className="text-white/80 mt-2">Last updated: November 2024</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-royal-blue mb-4">1. Agreement to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using Star Jump Kenya's services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-royal-blue mb-4">2. Service Description</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Star Jump Kenya provides:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Rental of inflatable play equipment (bouncy castles, slides, trampolines)</li>
                <li>Event setup and breakdown services</li>
                <li>Equipment supervision and safety monitoring</li>
                <li>Corporate and institutional play area installations</li>
                <li>Event planning and consultation services</li>
              </ul>
            </section>

            <section className="mb-8">
              <div className="flex items-center mb-4">
                <CreditCard className="h-6 w-6 text-royal-blue mr-3" />
                <h2 className="text-2xl font-bold text-royal-blue">3. Booking and Payment Terms</h2>
              </div>
              
              <h3 className="text-xl font-semibold text-royal-blue mt-6 mb-3">Booking Process</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>All bookings must be confirmed in writing (email or signed contract)</li>
                <li>A 50% deposit is required to secure your booking</li>
                <li>Full payment is due 24 hours before the event date</li>
                <li>Prices are quoted in Kenyan Shillings (KES) and include VAT where applicable</li>
              </ul>

              <h3 className="text-xl font-semibold text-royal-blue mt-6 mb-3">Payment Methods</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>M-Pesa mobile money transfers</li>
                <li>Bank transfers to our designated account</li>
                <li>Cash payments (for deposits only)</li>
                <li>Corporate invoicing (for approved business clients)</li>
              </ul>

              <h3 className="text-xl font-semibold text-royal-blue mt-6 mb-3">Cancellation Policy</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>More than 7 days:</strong> Full refund minus 10% processing fee</li>
                <li><strong>3-7 days:</strong> 50% refund</li>
                <li><strong>Less than 3 days:</strong> No refund</li>
                <li><strong>Weather cancellations:</strong> Full refund or rescheduling at no extra cost</li>
              </ul>
            </section>

            <section className="mb-8">
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-royal-blue mr-3" />
                <h2 className="text-2xl font-bold text-royal-blue">4. Safety and Liability</h2>
              </div>
              
              <h3 className="text-xl font-semibold text-royal-blue mt-6 mb-3">Safety Requirements</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Adult supervision is required at all times during equipment use</li>
                <li>Maximum capacity limits must be strictly observed</li>
                <li>Age restrictions apply to different equipment types</li>
                <li>No shoes, sharp objects, or food allowed on inflatable equipment</li>
                <li>Equipment must not be used in adverse weather conditions</li>
              </ul>

              <h3 className="text-xl font-semibold text-royal-blue mt-6 mb-3">Liability and Insurance</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Star Jump Kenya carries comprehensive public liability insurance</li>
                <li>Clients are responsible for ensuring adequate supervision</li>
                <li>We are not liable for injuries resulting from misuse of equipment</li>
                <li>Clients must report any incidents immediately</li>
                <li>Additional insurance may be required for high-risk events</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-royal-blue mb-4">5. Equipment Care and Damage</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Clients are responsible for:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Ensuring equipment is used according to safety guidelines</li>
                <li>Preventing damage from misuse or negligence</li>
                <li>Reporting any damage immediately to our staff</li>
                <li>Covering costs for repairs or replacement due to negligent damage</li>
                <li>Ensuring the venue is suitable for equipment installation</li>
              </ul>
            </section>

            <section className="mb-8">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-royal-blue mr-3" />
                <h2 className="text-2xl font-bold text-royal-blue">6. Weather and Force Majeure</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Star Jump Kenya reserves the right to cancel or postpone events due to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Severe weather conditions (heavy rain, strong winds)</li>
                <li>Government restrictions or public health emergencies</li>
                <li>Acts of God or circumstances beyond our control</li>
                <li>Safety concerns at the venue</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                In such cases, we will offer rescheduling or a full refund.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-royal-blue mb-4">7. Venue Requirements</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Clients must ensure the venue provides:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Adequate space for equipment setup (dimensions provided in advance)</li>
                <li>Level ground free from sharp objects or hazards</li>
                <li>Access to electrical power (where required)</li>
                <li>Vehicle access for delivery and collection</li>
                <li>Appropriate permissions for equipment installation</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-royal-blue mb-4">8. Intellectual Property</h2>
              <p className="text-gray-700 leading-relaxed">
                All content on our website, including text, graphics, logos, and images, is the property of Star Jump Kenya and protected by Kenyan and international copyright laws. Unauthorized use is prohibited.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-royal-blue mb-4">9. Privacy and Data Protection</h2>
              <p className="text-gray-700 leading-relaxed">
                Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information in compliance with Kenyan data protection laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-royal-blue mb-4">10. Dispute Resolution</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Any disputes arising from these terms will be resolved through:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Initial good faith negotiations between parties</li>
                <li>Mediation through a mutually agreed mediator</li>
                <li>Arbitration under Kenyan law if mediation fails</li>
                <li>Jurisdiction of Kenyan courts as a last resort</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-royal-blue mb-4">11. Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These terms and conditions are governed by and construed in accordance with the laws of Kenya. Any legal action or proceeding arising under these terms will be brought exclusively in the courts of Kenya.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-royal-blue mb-4">12. Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                Star Jump Kenya reserves the right to modify these terms at any time. Changes will be posted on our website and take effect immediately. Continued use of our services constitutes acceptance of modified terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-royal-blue mb-4">Contact Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                For questions about these terms and conditions, please contact us:
              </p>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="space-y-2">
                  <p><strong>Email:</strong> legal@starjump.co.ke</p>
                  <p><strong>Phone:</strong> +254 700 000 000</p>
                  <p><strong>Address:</strong> Star Jump Kenya, Garden City Mall, Thika Road, Nairobi</p>
                  <p><strong>Business Registration:</strong> [Registration Number]</p>
                </div>
              </div>
            </section>

            <div className="bg-blue-50 border-l-4 border-royal-blue p-6 rounded-r-xl">
              <p className="text-royal-blue font-semibold">
                By using Star Jump Kenya's services, you acknowledge that you have read, understood, and agree to be bound by these terms and conditions.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;