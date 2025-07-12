# Star Jump Kenya - Children's Entertainment Website

A modern, responsive website for Star Jump Kenya, a leading provider of children's play equipment and entertainment services across Kenya.

## 🇰🇪 Features

- **Kenya-Focused**: All content, pricing (KES), and locations are Kenya-specific
- **Supabase Integration**: Real-time database for events, products, and content management
- **Admin Dashboard**: Complete content management system
- **Responsive Design**: Works perfectly on all devices
- **Modern UI**: Beautiful, playful design with animations

## 🗄️ Database Schema

The application uses Supabase with the following tables:

### Events
- Event management with Kenya locations (Greenspan Mall, Garden City Mall, Galleria Mall)
- Featured events system
- Categories and scheduling
- Time and location tracking

### Products
- Product catalog with KES pricing
- Stock management
- Featured products
- Rating system (1-5 stars)
- Categories (Bouncy Castle, Slide, Trampoline, etc.)

### Sliders
- Homepage image slider management
- Order positioning
- Active/inactive states
- Title and subtitle support

### Info Sections
- Editable content sections
- Layout options (left/right image)
- Section keys for different pages
- Rich text content

### Site Assets
- Logo and navigation graphics
- Footer images
- Menu item cloud backgrounds
- Placement hints for positioning

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase account

### Setup

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Configure Supabase**
   - Create a new Supabase project
   - Run the migration file: `supabase/migrations/create_star_jump_schema.sql`
   - Update `.env` with your Supabase credentials:
     ```
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

3. **Start Development**
   ```bash
   npm run dev
   ```

## 🔧 Admin Access

- **URL**: `/admin/login`
- **Username**: `admin`
- **Password**: `starjump2024`

### Admin Features
- **Events Management**: Both local and Supabase-powered event management
- **Products Management**: KES pricing, stock tracking, featured products
- **Image Slider Management**: Homepage slider with ordering
- **Info Sections Management**: Editable content blocks
- **Booking CTA Management**: Call-to-action customization

## 🌍 Kenya-Specific Features

- **Currency**: All prices in Kenyan Shillings (KES) with proper formatting
- **Locations**: 
  - Greenspan Mall, Nairobi
  - Garden City Mall, Nairobi
  - Galleria Mall, Nairobi
- **Local Context**: Kenya-focused content throughout
- **Event Categories**: Festival, School Event, Corporate, Community, Mall Event

## 📱 Pages

- **Home**: Hero slider, events, info section, shop preview
- **About Us**: Company story, team, values
- **Corporate**: B2B services for institutions
- **Events**: Upcoming events and activities (Supabase-powered)
- **Shop**: Product catalog with KES pricing (Supabase-powered)
- **Blog**: Articles and insights
- **Contact**: Contact forms and location info
- **Booking**: Equipment rental booking form

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Authentication**: Supabase Auth with RLS

## 🎨 Design Features

- **Whimsical Theme**: Playful, colorful design perfect for children's entertainment
- **Cloud Backgrounds**: Colorful clouds behind menu items
- **Animations**: Floating elements and smooth transitions
- **Kenya Colors**: Royal blue, star yellow, bright orange, fun pink, grass green
- **Responsive**: Mobile-first design approach
- **Accessibility**: Proper contrast ratios and keyboard navigation

## 📊 Database Management

The application supports both local content management (for backward compatibility) and Supabase integration for production use. The admin dashboard provides interfaces for both systems:

- **Local Management**: Uses React context for immediate updates
- **Supabase Management**: Real-time database with proper security

## 🔒 Security

- **Row Level Security (RLS)**: Enabled on all Supabase tables
- **Public Read Access**: Content is publicly readable
- **Authenticated Write Access**: Admin functions require authentication
- **Environment Variables**: Sensitive data stored securely
- **Input Validation**: Form validation and sanitization

## 🚀 Deployment

The application is ready for deployment on platforms like:
- Vercel
- Netlify
- Railway
- Any platform supporting Node.js and static sites

## 📞 Support

For technical support or questions about the Star Jump Kenya website, please contact the development team.

---

**Star Jump Kenya** - Bringing joy and excitement to children across Kenya! 🇰🇪

### Sample Data Included

The migration includes sample data for:
- 3 events in different Kenya locations
- 4 products with KES pricing
- 3 homepage sliders
- 1 info section for the homepage

All data is Kenya-focused and ready for production use.