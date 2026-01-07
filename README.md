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
- **Shopping Cart** - Slide-out drawer with real-time updates, localStorage persistence
- **Admin Dashboard** - Analytics with charts, sales statistics, product views tracking
- **Product Management** - Full CRUD interface for managing products, inventory, and pricing
- **Additional Pages** - About, Contact, Shipping information

### Technical Features
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Multilingual Ready** - Infrastructure for UA, EN, DE, PL support
- **SEO Optimized** - Semantic HTML, meta tags, structured data ready
- **Accessibility** - ARIA labels, keyboard navigation, high contrast
- **Performance** - Optimized images, lazy loading, efficient rendering

### Backend & E-commerce Features
- **FastAPI Backend** - High-performance Python API
- **JWT Authentication** - Secure admin access with bcrypt password hashing
- **Payment Processing** - Stripe, Przelewy24 (BLIK), and bank transfer support
- **Shipping Integrations** - InPost, DHL, Nova Poshta, Poczta Polska APIs
- **Product Management** - Full CRUD with image upload and optimization
- **Order Management** - Order tracking, status updates, payment verification
- **Analytics & Statistics** - Product views, sales trends, revenue tracking
- **Email Notifications** - Order confirmations and updates (configurable)
- **Database Migrations** - Alembic for version-controlled schema changes
- **API Documentation** - Auto-generated Swagger/OpenAPI docs

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

## 🐳 Docker Deployment (Recommended)

The easiest way to run the entire stack (Frontend + Backend + Database) is using Docker Compose.

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+

### Quick Start with Docker

```bash
# Clone the repository
git clone https://github.com/ChuprinaDaria/skrynia.git
cd skrynia

# Create environment file
cp .env.example .env
# Edit .env with your configuration (payment keys, email settings, etc.)

# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Services

The Docker Compose setup includes:

1. **PostgreSQL Database** (port 5432)
   - Pre-configured with user and database
   - Persistent volume for data storage
   - Health checks

2. **FastAPI Backend** (port 8000)
   - Automatic database migrations with Alembic
   - Sample data initialization
   - Hot reload in development
   - API documentation at http://localhost:8000/docs

3. **Next.js Frontend** (port 3000)
   - Optimized production build
   - Standalone output mode
   - Environment variables injected

### Access Points

After running `docker-compose up -d`:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Admin Dashboard**: http://localhost:3000/admin
  - Default credentials: `admin@skrynia.com` / `admin123` (change in .env)

### Environment Variables

Create a `.env` file in the root directory (see `.env.example`):

```bash
# Required
SECRET_KEY=your-secret-key-here
ADMIN_EMAIL=admin@skrynia.com
ADMIN_PASSWORD=change-this-password

# Payment Providers (get from respective dashboards)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
P24_MERCHANT_ID=123456
P24_POS_ID=123456
P24_CRC=...

# Shipping Providers (optional)
INPOST_API_TOKEN=...
NOVA_POSHTA_API_KEY=...
DHL_API_KEY=...

# Email (for notifications)
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### Database Management

```bash
# Access PostgreSQL shell
docker-compose exec db psql -U skrynia_user -d skrynia_db

# Run migrations manually
docker-compose exec backend alembic upgrade head

# Create new migration
docker-compose exec backend alembic revision --autogenerate -m "description"

# View database logs
docker-compose logs db

# Reset database (WARNING: deletes all data)
docker-compose down -v
docker-compose up -d
```

### Backend Management

```bash
# View backend logs
docker-compose logs -f backend

# Restart backend only
docker-compose restart backend

# Execute Python commands
docker-compose exec backend python -c "from app.db.session import SessionLocal; print('DB connected')"

# Install new Python package
docker-compose exec backend pip install package-name
# Then rebuild: docker-compose build backend
```

### Frontend Management

```bash
# View frontend logs
docker-compose logs -f frontend

# Rebuild frontend
docker-compose build frontend
docker-compose up -d frontend

# Access frontend shell
docker-compose exec frontend sh
```

### Development vs Production

**Development** (with hot reload):
```bash
# Modify docker-compose.yml backend command to:
command: sh -c "alembic upgrade head && python init_db.py && uvicorn app.main:app --host 0.0.0.0 --reload"

# Frontend automatically uses hot reload in standalone mode
```

**Production**:
```bash
# Set environment variables
DEBUG=False
NODE_ENV=production

# Use production-grade WSGI server (already configured)
# Ensure SECRET_KEY is strong and unique
# Configure proper database backups
```

### Troubleshooting

**Port conflicts**:
```bash
# Check if ports are in use
lsof -i :3000
lsof -i :8000
lsof -i :5432

# Change ports in docker-compose.yml if needed
```

**Database connection issues**:
```bash
# Check database health
docker-compose ps
# Wait for db health check to pass before backend starts
```

**Permission issues**:
```bash
# Fix file permissions
sudo chown -R $USER:$USER .
```

**Clean restart**:
```bash
# Stop and remove all containers, networks, volumes
docker-compose down -v
docker-compose up -d --build
```

## 📁 Project Structure

```
skrynia/
├── app/                          # Next.js App Router pages (Frontend)
│   ├── admin/                   # Admin panel
│   │   ├── page.tsx            # Dashboard with analytics & charts
│   │   └── products/           # Product management (CRUD)
│   ├── about/                   # About page
│   ├── collections/             # Product catalog
│   ├── contact/                 # Contact page
│   ├── products/[slug]/         # Product detail pages
│   ├── shipping/                # Shipping info
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage
│   └── globals.css              # Global styles
├── components/
│   ├── cart/                    # Shopping cart components
│   ├── layout/                  # Layout components (Header, Footer, Hero)
│   ├── product/                 # Product-related components
│   └── ui/                      # Reusable UI components & icons
├── contexts/                    # React Context providers
│   └── CartContext.tsx          # Global cart state management
├── lib/                         # Utility functions
│   └── cart.ts                  # Cart logic with localStorage
├── types/                       # TypeScript type definitions
├── public/
│   └── images/                  # Static images
├── backend/                     # FastAPI Backend
│   ├── app/
│   │   ├── api/v1/endpoints/   # API routes
│   │   │   ├── auth.py         # Authentication endpoints
│   │   │   ├── products.py     # Product CRUD
│   │   │   ├── orders.py       # Order management
│   │   │   ├── payments.py     # Payment processing
│   │   │   ├── shipping.py     # Shipping integrations
│   │   │   ├── admin.py        # Admin dashboard & analytics
│   │   │   └── upload.py       # File uploads
│   │   ├── models/             # SQLAlchemy models
│   │   │   ├── user.py
│   │   │   ├── product.py
│   │   │   ├── order.py
│   │   │   ├── analytics.py
│   │   │   └── shipping.py
│   │   ├── services/           # Business logic
│   │   │   ├── payment_stripe.py
│   │   │   ├── payment_przelewy24.py
│   │   │   ├── shipping_inpost.py
│   │   │   ├── shipping_novaposhta.py
│   │   │   └── email.py
│   │   ├── core/               # Core configuration
│   │   │   ├── config.py       # Settings
│   │   │   └── security.py     # JWT & auth utils
│   │   ├── db/                 # Database setup
│   │   └── main.py             # FastAPI app entry
│   ├── alembic/                # Database migrations
│   ├── static/                 # Uploaded files
│   ├── Dockerfile
│   └── requirements.txt
├── docker-compose.yml          # Full stack orchestration
├── Dockerfile.frontend         # Frontend container
├── .env.example                # Environment variables template
└── locales/                    # Translation files (future)
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Fonts**: Google Fonts (Cinzel, Inter)
- **Icons**: Custom SVG components
- **State Management**: React Context API
- **Charts**: Recharts

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Language**: Python 3.11+
- **Database**: PostgreSQL 15
- **ORM**: SQLAlchemy
- **Authentication**: JWT tokens with bcrypt
- **Migrations**: Alembic
- **Image Processing**: Pillow

### Payment Integrations
- **Stripe**: Credit card payments
- **Przelewy24**: Polish payment gateway with BLIK support
- **Bank Transfer**: IBAN payments

### Shipping Integrations
- **InPost**: Polish parcel lockers (Paczkomaty)
- **Poczta Polska**: Polish postal service
- **DHL Express**: International courier
- **Nova Poshta**: Ukrainian postal service

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Deployment**: Production-ready

## 🎯 Roadmap

### Completed ✅
- [x] Backend Integration (FastAPI)
- [x] Payment Gateway Integration (Stripe, Przelewy24, BLIK)
- [x] User Authentication & Accounts
- [x] Admin Dashboard with Analytics
- [x] Product Management (CRUD)
- [x] Shipping Integrations (InPost, DHL, Nova Poshta, Poczta Polska)
- [x] Shopping Cart with localStorage
- [x] Docker Deployment Setup

### In Progress 🚧
- [ ] Full i18n Implementation (4 languages)
- [ ] Email Notifications
- [ ] Product Image Uploads

### Planned 📋
- [ ] Wishlist Functionality
- [ ] Product Search with Algolia
- [ ] Product Reviews
- [ ] Customer Order Tracking Portal

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
