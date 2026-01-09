# Skrynia Pani Darii - Backend API 🔮

FastAPI backend for the premium e-commerce platform specializing in handmade ethnic jewelry.

## 🚀 Features

### Core Functionality
- ✅ **RESTful API** with FastAPI
- ✅ **PostgreSQL Database** with SQLAlchemy ORM
- ✅ **JWT Authentication** for admin panel
- ✅ **Product Management** (CRUD operations)
- ✅ **Order Management** with full lifecycle tracking
- ✅ **Multi-language Support** (UA, EN, DE, PL)

### Payment Integrations
- 💳 **Stripe** - International credit/debit cards
- 🇵🇱 **Przelewy24** - Polish payment gateway
- 📱 **BLIK** - Polish mobile payments
- 🏦 **Bank Transfer (IBAN)** support

### Additional Features
- 📸 **Image Upload** with automatic optimization
- 📧 **Email Notifications** (order confirmations)
- 🔐 **Secure** with password hashing and JWT
- 📊 **Database Migrations** with Alembic
- 🐳 **Docker** ready for deployment
- 📝 **Auto-generated API Docs** with Swagger

## 📋 Prerequisites

- Python 3.11+
- PostgreSQL 15+
- Docker & Docker Compose (optional)

## 🛠️ Installation

### Option 1: Local Development

1. **Create virtual environment**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies**
```bash
pip install -r requirements.txt
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Create PostgreSQL database**
```sql
CREATE DATABASE skrynia_db;
CREATE USER skrynia_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE skrynia_db TO skrynia_user;
```

5. **Run database migrations**
```bash
alembic upgrade head
```

6. **Initialize database with sample data**
```bash
python init_db.py
```

7. **Start development server**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Option 2: Docker Compose

1. **Start all services**
```bash
cd backend
docker-compose up -d
```

2. **Initialize database**
```bash
docker-compose exec backend python init_db.py
```

The API will be available at `http://localhost:8000`

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc

## 🔑 Default Admin Credentials

After running `init_db.py`:
- **Email**: admin@skrynia.com (from .env)
- **Password**: (from .env ADMIN_PASSWORD)

**⚠️ IMPORTANT**: Change these credentials in production!

## 📁 Project Structure

```
backend/
├── app/
│   ├── api/v1/endpoints/    # API route handlers
│   │   ├── auth.py          # Authentication (login/register)
│   │   ├── products.py      # Product CRUD
│   │   ├── orders.py        # Order management
│   │   ├── payments.py      # Payment processing
│   │   └── upload.py        # File uploads
│   ├── core/                # Core functionality
│   │   ├── config.py        # Settings
│   │   └── security.py      # Auth & encryption
│   ├── db/                  # Database
│   │   ├── base.py          # Base model
│   │   └── session.py       # DB session
│   ├── models/              # SQLAlchemy models
│   │   ├── user.py
│   │   ├── product.py
│   │   ├── order.py
│   │   └── category.py
│   ├── schemas/             # Pydantic schemas
│   │   ├── user.py
│   │   ├── product.py
│   │   └── order.py
│   ├── services/            # Business logic
│   │   ├── payment_stripe.py
│   │   └── payment_p24.py
│   └── main.py              # FastAPI app
├── alembic/                 # Database migrations
├── static/uploads/          # Uploaded files
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
└── init_db.py               # Database initialization
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/v1/auth/login       # Login
POST   /api/v1/auth/register    # Register user
```

### Products
```
GET    /api/v1/products         # List products
GET    /api/v1/products/{slug}  # Get product by slug
POST   /api/v1/products         # Create product (admin)
PATCH  /api/v1/products/{id}    # Update product (admin)
DELETE /api/v1/products/{id}    # Delete product (admin)
```

### Orders
```
POST   /api/v1/orders           # Create order
GET    /api/v1/orders           # List orders (admin)
GET    /api/v1/orders/{id}      # Get order (admin)
GET    /api/v1/orders/number/{number}  # Track order (customer)
PATCH  /api/v1/orders/{id}      # Update order (admin)
```

### Payments
```
POST   /api/v1/payments/create-payment-intent  # Create payment
POST   /api/v1/payments/blik                   # BLIK payment
POST   /api/v1/payments/stripe/webhook         # Stripe webhook
POST   /api/v1/payments/p24/webhook            # P24 webhook
```

### File Upload
```
POST   /api/v1/upload/image         # Upload single image (admin)
POST   /api/v1/upload/images/bulk   # Upload multiple images (admin)
DELETE /api/v1/upload/image/{filename}  # Delete image (admin)
```

## 💳 Payment Gateway Setup

### Stripe

1. Get API keys from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Add to `.env`:
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Przelewy24

1. Register at [Przelewy24](https://www.przelewy24.pl/)
2. Get credentials from merchant panel
3. Add to `.env`:
```env
P24_MERCHANT_ID=your_merchant_id
P24_POS_ID=your_pos_id
P24_CRC=your_crc_key
P24_API_KEY=your_api_key
P24_TEST_MODE=True
```

## 🗄️ Database Migrations

### Create a new migration
```bash
alembic revision --autogenerate -m "Description of changes"
```

### Apply migrations
```bash
alembic upgrade head
```

### Rollback migration
```bash
alembic downgrade -1
```

## 🧪 Testing

Run tests with pytest:
```bash
pytest
```

## 🚀 Deployment

### Environment Variables

Set these in production:
- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - Strong secret key for JWT
- `STRIPE_SECRET_KEY` - Production Stripe key
- `P24_TEST_MODE=False` - Use production P24
- `DEBUG=False` - Disable debug mode

### Docker Deployment

1. Build and push image:
```bash
docker build -t skrynia-backend .
docker push your-registry/skrynia-backend
```

2. Deploy with docker-compose or Kubernetes

### Security Checklist

- [ ] Change default admin password
- [ ] Use strong SECRET_KEY
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up firewall rules
- [ ] Regular database backups
- [ ] Monitor API logs

## 📊 Database Schema

### Main Tables
- `users` - Admin and customer accounts
- `categories` - Product categories
- `products` - Product catalog
- `product_images` - Product images
- `orders` - Customer orders
- `order_items` - Order line items

## 🛡️ Security Features

- Password hashing with bcrypt
- JWT token authentication
- CORS configuration
- SQL injection protection (SQLAlchemy)
- File upload validation
- Rate limiting (implement in production)

## 📧 Email Configuration

Configure SMTP in `.env`:
```env
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
```

For Gmail, create an [App Password](https://support.google.com/accounts/answer/185833).

## 🐛 Troubleshooting

### Database connection error
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Ensure database exists

### Migration errors
- Drop database and recreate
- Run `alembic stamp head` then `alembic upgrade head`

### Import errors
- Ensure virtual environment is activated
- Reinstall requirements: `pip install -r requirements.txt`

## 📝 License

Private project for Skrynia Pani Darii.

## 👤 Author

**Daria**
Skrynia Pani Darii - Premium Handmade Jewelry

---

**Кожна прикраса — це портал до історії наших предків** ✨
