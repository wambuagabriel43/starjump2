import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ContentProvider } from './context/ContentContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import PageBackground from './components/PageBackground';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Corporate from './pages/Corporate';
import Events from './pages/Events';
import BookingForm from './pages/BookingForm';
import Shop from './pages/Shop';
import Blog from './pages/Blog';
import ContactUs from './pages/ContactUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <Router>
          <div className="min-h-screen font-poppins">
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route 
                path="/admin/*" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Public Routes with Page Backgrounds */}
              <Route 
                path="/" 
                element={
                  <PageBackground page="home">
                    <Header />
                    <Home />
                    <Footer />
                  </PageBackground>
                } 
              />
              <Route 
                path="/about" 
                element={
                  <PageBackground page="about">
                    <Header />
                    <AboutUs />
                    <Footer />
                  </PageBackground>
                } 
              />
              <Route 
                path="/corporate" 
                element={
                  <PageBackground page="corporate">
                    <Header />
                    <Corporate />
                    <Footer />
                  </PageBackground>
                } 
              />
              <Route 
                path="/events" 
                element={
                  <PageBackground page="events">
                    <Header />
                    <Events />
                    <Footer />
                  </PageBackground>
                } 
              />
              <Route 
                path="/booking" 
                element={
                  <PageBackground page="booking">
                    <Header />
                    <BookingForm />
                    <Footer />
                  </PageBackground>
                } 
              />
              <Route 
                path="/shop" 
                element={
                  <PageBackground page="shop">
                    <Header />
                    <Shop />
                    <Footer />
                  </PageBackground>
                } 
              />
              <Route 
                path="/blog" 
                element={
                  <PageBackground page="blog">
                    <Header />
                    <Blog />
                    <Footer />
                  </PageBackground>
                } 
              />
              <Route 
                path="/contact" 
                element={
                  <PageBackground page="contact">
                    <Header />
                    <ContactUs />
                    <Footer />
                  </PageBackground>
                } 
              />
              <Route 
                path="/privacy-policy" 
                element={
                  <PageBackground page="contact">
                    <Header />
                    <PrivacyPolicy />
                    <Footer />
                  </PageBackground>
                } 
              />
              <Route 
                path="/terms-conditions" 
                element={
                  <PageBackground page="contact">
                    <Header />
                    <TermsConditions />
                    <Footer />
                  </PageBackground>
                } 
              />
            </Routes>
          </div>
        </Router>
      </ContentProvider>
    </AuthProvider>
  );
}

export default App;