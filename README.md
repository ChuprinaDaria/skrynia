# Скриня Пані Дарії 🪔

Premium e-commerce website for handmade ethnic jewelry with a dark, mystical aesthetic inspired by Slavic, Viking, and Celtic heritage.

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwind-css)

## 🌟 Features

### Design & UX
- **Dark Earthy Luxury Aesthetic** - Sophisticated, mystical design inspired by ancient cultures
- **Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- **Smooth Animations** - Elegant transitions and micro-interactions throughout
- **Custom SVG Symbols** - Authentic cultural icons (Alatyr, Valknut, Triquetra)

### Pages & Components
- **Homepage** - Hero section with animated Alatyr symbol, collections preview, featured products, newsletter signup
- **Product Catalog** - Grid layout with advanced filtering, sorting, and search
- **Product Detail** - Image gallery, detailed descriptions, legend sections, specifications
- **Shopping Cart** - Slide-out drawer with real-time updates
- **Additional Pages** - About, Contact, Shipping information

### Technical Features
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Multilingual Ready** - Infrastructure for UA, EN, DE, PL support
- **SEO Optimized** - Semantic HTML, meta tags, structured data ready
- **Accessibility** - ARIA labels, keyboard navigation, high contrast
- **Performance** - Optimized images, lazy loading, efficient rendering

## 🎨 Design System

### Color Palette
```css
Deep Black:    #0B0C10  /* Main background */
Ivory/Bone:    #FFFFF0  /* Text, light accents */
Oxblood Red:   #660000  /* CTAs, active states */
Sage Green:    #7A8B8B  /* Secondary accents */
Warm Coral:    #C77966  /* Product highlights */
Footer Black:  #1A1C20  /* Footer background */
```

### Typography
- **Headings**: Cinzel (serif) - Elegant, commanding, runic feel
- **Body**: Inter (sans-serif) - Clean, readable, modern
- **Cyrillic Support**: Full support for Ukrainian language

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/ChuprinaDaria/skrynia.git
cd skrynia

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
skrynia/
├── app/                      # Next.js App Router pages
│   ├── about/               # About page
│   ├── collections/         # Product catalog
│   ├── contact/            # Contact page
│   ├── products/[slug]/    # Product detail pages
│   ├── shipping/           # Shipping info
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   └── globals.css         # Global styles
├── components/
│   ├── cart/               # Shopping cart components
│   ├── layout/             # Layout components (Header, Footer, Hero, etc.)
│   ├── product/            # Product-related components
│   └── ui/                 # Reusable UI components & icons
├── public/
│   └── images/             # Static images
├── types/                  # TypeScript type definitions
├── lib/                    # Utility functions
└── locales/               # Translation files (future)
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Fonts**: Google Fonts (Cinzel, Inter)
- **Icons**: Custom SVG components
- **Deployment**: Vercel-ready

## 🎯 Roadmap

- [ ] Backend Integration (FastAPI)
- [ ] Full i18n Implementation (4 languages)
- [ ] Payment Gateway Integration (Stripe/PayPal)
- [ ] User Authentication & Accounts
- [ ] Wishlist Functionality
- [ ] Product Search with Algolia
- [ ] Admin Dashboard
- [ ] Email Notifications
- [ ] Product Reviews
- [ ] Analytics Integration

## 🌍 Internationalization

The project is prepared for multilingual support:
- 🇺🇦 Ukrainian (default)
- 🇬🇧 English
- 🇩🇪 German
- 🇵🇱 Polish

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1199px
- **Desktop**: ≥ 1200px

## ♿ Accessibility

- Semantic HTML5 elements
- ARIA labels and roles
- Keyboard navigation support
- High contrast ratios (WCAG AA)
- Focus indicators
- Alt text for all images

## 🎨 Component Library

### UI Components
- `Button` - Primary, secondary, ghost variants
- `Modal` - Accessible modal dialogs
- `ProductCard` - Reusable product display
- `FilterSidebar` - Advanced filtering
- `CartDrawer` - Slide-out shopping cart

### Icon Components
- `AlatyrIcon` - Slavic symbol
- `ValknutIcon` - Viking symbol
- `TriquetraIcon` - Celtic symbol

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Code Style

- ESLint configuration included
- Prettier recommended
- TypeScript strict mode
- Component-first architecture

## 📄 License

Private project for Skrynia Pani Darii.

## 👩‍💻 Author

**Daria**
Handmade ethnic jewelry artisan
Location: Poland, EU

## 🙏 Acknowledgments

- Design inspired by ancient Slavic, Viking, and Celtic cultures
- Built with modern web technologies
- Created with love and respect for traditional craftsmanship

---

**Кожна прикраса — це портал до історії наших предків** ✨
