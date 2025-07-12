import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { useSliders } from '../hooks/useSupabaseData';

const ImageSlider: React.FC = () => {
  const { sliders, loading, error } = useSliders();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying || sliders.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliders.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, sliders.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliders.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliders.length) % sliders.length);
  };

  if (loading) {
    return (
      <div className="h-96 md:h-[500px] lg:h-[600px] bg-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-royal-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading slides...</p>
        </div>
      </div>
    );
  }

  if (error || sliders.length === 0) {
    return (
      <div className="h-96 md:h-[500px] lg:h-[600px] bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">No slides available</p>
      </div>
    );
  }

  return (
    <div className="relative h-96 md:h-[500px] lg:h-[600px] overflow-hidden">
      {/* Slides */}
      {sliders.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image_url}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          
          {/* Text Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4 max-w-4xl">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg animate-float">
                {slide.title}
              </h2>
              {slide.subtitle && (
                <p className="text-lg md:text-xl lg:text-2xl font-medium drop-shadow-md">
                  {slide.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
      >
        <ChevronLeft className="h-6 w-6 text-royal-blue" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
      >
        <ChevronRight className="h-6 w-6 text-royal-blue" />
      </button>

      {/* Play/Pause Button */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="absolute bottom-4 right-4 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
      >
        {isPlaying ? (
          <Pause className="h-5 w-5 text-royal-blue" />
        ) : (
          <Play className="h-5 w-5 text-royal-blue" />
        )}
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {sliders.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-star-yellow shadow-lg'
                : 'bg-white bg-opacity-50 hover:bg-opacity-80'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;