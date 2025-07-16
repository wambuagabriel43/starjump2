import React from 'react';
import { usePageContent, getPageContentBySection } from '../hooks/useContentData';
import ImageSlider from '../components/ImageSlider';
import UpcomingEvents from '../components/UpcomingEvents';
import InfoSection from '../components/InfoSection';
import BookingCTA from '../components/BookingCTA';
import ShopPreview from '../components/ShopPreview';

const Home: React.FC = () => {
  const { content: pageContent, loading } = usePageContent('home');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main>
      <ImageSlider />
      <UpcomingEvents />
      <InfoSection pageContent={pageContent} />
      <BookingCTA pageContent={pageContent} />
      <ShopPreview pageContent={pageContent} />
    </main>
  );
};

export default Home;