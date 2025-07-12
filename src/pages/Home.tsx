import React from 'react';
import ImageSlider from '../components/ImageSlider';
import UpcomingEvents from '../components/UpcomingEvents';
import InfoSection from '../components/InfoSection';
import BookingCTA from '../components/BookingCTA';
import ShopPreview from '../components/ShopPreview';

const Home: React.FC = () => {
  return (
    <main>
      <ImageSlider />
      <UpcomingEvents />
      <InfoSection />
      <BookingCTA />
      <ShopPreview />
    </main>
  );
};

export default Home;