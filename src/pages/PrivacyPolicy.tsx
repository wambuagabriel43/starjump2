import React from 'react';
import { Shield, Eye, Lock, FileText } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Shield className="h-10 w-10 text-royal-blue" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Privacy Policy
          </h1>
          <p className="text-xl text-white/90">
            How Star Jump Kenya protects and handles your personal information
          </p>
          <p className="text-white/80 mt-2">Last updated: November 2024</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            
            <section className="mb-8">
              <div className="flex items-center mb-4">
                <Eye className="h-6 w-6 text-royal-blue mr-3" />
                <h2 className="text-2xl font-bold text-royal-blue">Information We Collect</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Star Jump Kenya ("we," "our," or "us") collects information you provide directly to us, such as when you:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Fill out booking forms or contact forms on our website</li>
                <li>Subscribe to our newsletter or marketing communications</li>
                <li>Participate in events or promotions</li>
                <li>Contact us via phone, email, or WhatsApp</li>
                <li>Visit our physical locations</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-royal-blue mt-6 mb-3">Types of Information</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Personal Information:</strong> Name, email address, phone number, physical address</li>
                <li><strong>Event Information:</strong> Event dates, locations, number of attendees, special requirements</li>
                <li><strong>Payment Information:</strong> Billing details (processed securely through third-party providers)</li>
                <li><strong>Communication Records:</strong> Records of our interactions with you</li>
              </ul>
            </section>

            <section className="mb-8">
              <div className="flex items-center mb-4">
                <FileText className="h-6 w-6 text-royal-blue mr-3" />
                <h2 className="text-2xl font-bold text-royal-blue">How We Use Your Information</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Process and fulfill your booking requests</li>
                <li>Communicate with you about your events and our services</li>
                <li>Send you marketing communications (with your consent)</li>
                <li>Improve our services and customer experience</li>
                <li>Comply with legal obligations and resolve disputes</li>
                <li>Ensure the safety and security of our events and equipment</li>
              </ul>
            </section>

            <section className="mb-8">
              <div className="flex items-center mb-4">
                <Lock className="h-6 w-6 text-royal-blue mr-3" />
                <h2 className="text-2xl font-bold text-royal-blue">Information Sharing and Disclosure</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Service Providers:</strong> We may share information with trusted third parties who assist us in operating our business</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li><strong>Consent:</strong> When you have given us explicit consent to share your information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-royal-blue mb-4">Data Protection and Security</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Secure data transmission using SSL encryption</li>
                <li>Regular security assessments and updates</li>
                <li>Limited access to personal information on a need-to-know basis</li>
                <li>Secure storage of physical and digital records</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-royal-blue mb-4">Your Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Under Kenyan data protection laws, you have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Access:</strong> Request copies of your personal information</li>
                <li><strong>Rectification:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Erasure:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request transfer of your information to another service provider</li>
                <li><strong>Objection:</strong> Object to processing of your personal information</li>
                <li><strong>Withdrawal:</strong> Withdraw consent for marketing communications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-royal-blue mb-4">Cookies and Tracking</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our website uses cookies and similar tracking technologies to enhance your browsing experience. We use:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
                <li><strong>Analytics Cookies:</strong> To understand how visitors use our website</li>
                <li><strong>Marketing Cookies:</strong> To deliver relevant advertisements (with your consent)</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-royal-blue mb-4">Children's Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                While our services are designed for children's entertainment, our website and marketing are directed at adults. We do not knowingly collect personal information from children under 13 without parental consent. If you believe we have collected information from a child under 13, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-royal-blue mb-4">International Transfers</h2>
              <p className="text-gray-700 leading-relaxed">
                Your information is primarily stored and processed in Kenya. If we transfer information outside Kenya, we ensure appropriate safeguards are in place to protect your personal information in accordance with this privacy policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-royal-blue mb-4">Changes to This Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the "Last updated" date. Your continued use of our services after such changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-royal-blue mb-4">Contact Us</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about this privacy policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="space-y-2">
                  <p><strong>Email:</strong> privacy@starjump.co.ke</p>
                  <p><strong>Phone:</strong> +254 700 000 000</p>
                  <p><strong>Address:</strong> Star Jump Kenya, Garden City Mall, Thika Road, Nairobi</p>
                  <p><strong>Data Protection Officer:</strong> dpo@starjump.co.ke</p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;