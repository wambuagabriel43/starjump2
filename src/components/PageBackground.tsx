import React from 'react';
import { useSiteSettings, useSiteAssets } from '../hooks/useSupabaseData';

interface PageBackgroundProps {
  page: string;
  children: React.ReactNode;
  className?: string;
}

const PageBackground: React.FC<PageBackgroundProps> = ({ page, children, className = '' }) => {
  const { settings } = useSiteSettings();
  const { assets } = useSiteAssets('menu_graphic');
  
  const backgroundColorKey = `${page}_background_color`;
  const backgroundColor = settings[backgroundColorKey] || '#4169E1'; // Default royal blue

  // Generate menu graphics CSS
  const menuGraphicsCSS = assets.map((asset, index) => {
    if (!asset.menu_item) return '';
    const menuClass = asset.menu_item.toLowerCase().replace(/\s+/g, '-');
    return `
      .menu-${menuClass} {
        background-image: url('${asset.image_url}');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      }
    `;
  }).join('\n');

  return (
    <>
      <style>
        {`
          :root {
            --page-bg-color: ${backgroundColor};
            --page-text-color: ${backgroundColor === '#FFFFFF' || backgroundColor === '#ffffff' ? '#1a1a1a' : '#ffffff'};
            --page-accent-color: ${backgroundColor === '#4169E1' ? '#FFD700' : '#4169E1'};
          }
          
          ${menuGraphicsCSS}
          
          /* Page-specific theming */
          .page-themed {
            background-color: var(--page-bg-color);
            color: var(--page-text-color);
          }
          
          .page-themed .header-themed {
            background: linear-gradient(to right, var(--page-bg-color), ${backgroundColor}dd);
          }
          
          .page-themed .footer-themed {
            background: linear-gradient(to bottom right, var(--page-bg-color), ${backgroundColor}cc);
          }
          
          .page-themed .text-themed {
            color: var(--page-text-color);
          }
          
          .page-themed .accent-themed {
            color: var(--page-accent-color);
          }
          
          .page-themed .bg-themed {
            background-color: var(--page-bg-color);
          }
          
          .page-themed .border-themed {
            border-color: var(--page-text-color);
          }
          
          .page-themed .shadow-themed {
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          }
        `}
      </style>
      <div 
        className={`min-h-screen page-themed ${className}`}
        style={{ backgroundColor }}
      >
        {children}
      </div>
    </>
  );
};

export default PageBackground;