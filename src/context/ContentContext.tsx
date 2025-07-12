import React, { createContext, useContext, useState, useEffect } from 'react';

interface SlideData {
  id: number;
  image: string;
  title: string;
  subtitle: string;
}

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  category: string;
}

interface ContentData {
  slides: SlideData[];
  events: Event[];
  products: Product[];
  infoSection: {
    title: string;
    subtitle: string;
    description: string;
    image: string;
    benefits: string[];
    stats: {
      events: string;
      experience: string;
      support: string;
    };
  };
  bookingCTA: {
    title: string;
    subtitle: string;
    description: string;
    features: Array<{
      title: string;
      description: string;
    }>;
  };
}

interface ContentContextType {
  content: ContentData;
  updateContent: (section: keyof ContentData, data: any) => void;
}

const defaultContent: ContentData = {
  slides: [
    {
      id: 1,
      image: 'https://images.pexels.com/photos/1104014/pexels-photo-1104014.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      title: 'Bouncy Castle Adventures',
      subtitle: 'Safe, fun, and unforgettable experiences for your little ones!'
    },
    {
      id: 2,
      image: 'https://images.pexels.com/photos/1619654/pexels-photo-1619654.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      title: 'Birthday Party Magic',
      subtitle: 'Make every celebration extraordinary with our premium equipment!'
    },
    {
      id: 3,
      image: 'https://images.pexels.com/photos/1292294/pexels-photo-1292294.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      title: 'School Events & More',
      subtitle: 'Professional equipment rental for schools and corporate events!'
    }
  ],
  events: [
    {
      id: 1,
      title: 'Summer Fun Festival',
      date: 'July 15, 2024',
      time: '10:00 AM - 4:00 PM',
      location: 'Central Park',
      description: 'Join us for a day of bouncing, sliding, and endless fun! Perfect for families and kids of all ages.',
      image: 'https://images.pexels.com/photos/1619654/pexels-photo-1619654.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1'
    },
    {
      id: 2,
      title: 'School Holiday Extravaganza',
      date: 'July 22, 2024',
      time: '9:00 AM - 3:00 PM',
      location: 'Riverside School',
      description: 'Special school holiday event with multiple bouncy castles, slides, and interactive games for students.',
      image: 'https://images.pexels.com/photos/1104014/pexels-photo-1104014.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1'
    },
    {
      id: 3,
      title: 'Community Sports Day',
      date: 'August 5, 2024',
      time: '8:00 AM - 6:00 PM',
      location: 'Town Sports Ground',
      description: 'Supporting our local community with fun inflatables and entertainment for the whole family to enjoy.',
      image: 'https://images.pexels.com/photos/1292294/pexels-photo-1292294.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1'
    }
  ],
  products: [
    {
      id: 1,
      name: 'Castle Bouncer Deluxe',
      price: 150,
      image: 'https://images.pexels.com/photos/1104014/pexels-photo-1104014.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
      rating: 5,
      category: 'Bouncy Castle'
    },
    {
      id: 2,
      name: 'Rainbow Mega Slide',
      price: 120,
      image: 'https://images.pexels.com/photos/1619654/pexels-photo-1619654.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
      rating: 5,
      category: 'Slide'
    },
    {
      id: 3,
      name: 'Super Trampoline Set',
      price: 80,
      image: 'https://images.pexels.com/photos/1292294/pexels-photo-1292294.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
      rating: 4,
      category: 'Trampoline'
    },
    {
      id: 4,
      name: 'Star Jump T-Shirt',
      price: 25,
      image: 'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
      rating: 5,
      category: 'Apparel'
    }
  ],
  infoSection: {
    title: 'Why Choose Star Jump?',
    subtitle: '',
    description: 'At Star Jump, we understand that every celebration deserves to be extraordinary. With over 10 years of experience in children\'s entertainment, we bring joy, safety, and unforgettable memories to your doorstep.',
    image: 'https://images.pexels.com/photos/1104014/pexels-photo-1104014.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
    benefits: [
      'Safety certified equipment with regular inspections',
      'Creating magical memories for children and families',
      'Premium quality inflatables and entertainment',
      'Professional setup and supervision included'
    ],
    stats: {
      events: '500+',
      experience: '10+',
      support: '24/7'
    }
  },
  bookingCTA: {
    title: 'Book a Fun Space Today!',
    subtitle: '',
    description: 'Bring the fun to your doorstep! Whether it\'s a birthday, corporate event, or school function, our mobile fun stations are a hit.',
    features: [
      {
        title: 'Flexible Booking',
        description: 'Same-day or advance bookings available'
      },
      {
        title: 'Full Setup Service',
        description: 'Professional delivery, setup, and collection'
      },
      {
        title: '24/7 Support',
        description: 'Round-the-clock assistance for your event'
      }
    ]
  }
};

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<ContentData>(defaultContent);

  useEffect(() => {
    const savedContent = localStorage.getItem('starjump_content');
    if (savedContent) {
      try {
        setContent(JSON.parse(savedContent));
      } catch (error) {
        console.error('Error loading saved content:', error);
      }
    }
  }, []);

  const updateContent = (section: keyof ContentData, data: any) => {
    const newContent = {
      ...content,
      [section]: data
    };
    setContent(newContent);
    localStorage.setItem('starjump_content', JSON.stringify(newContent));
  };

  return (
    <ContentContext.Provider value={{ content, updateContent }}>
      {children}
    </ContentContext.Provider>
  );
};