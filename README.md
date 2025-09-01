# Expanders360 API

Global Expansion Management API built with NestJS, MySQL, and MongoDB.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MySQL 8.0+
- Redis (optional for local dev)
- MongoDB Atlas account
- Brevo SMTP account

### Environment Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and update all values
3. **NEVER commit your .env file!**

### Database Schema

![Database Schema](./docs/schema.png)

#### MySQL Tables:

- **users**: Authentication and authorization
- **clients**: Company information
- **projects**: Expansion projects with country and services
- **vendors**: Service providers with ratings and SLAs
- **matches**: Calculated matches between projects and vendors

#### MongoDB Collections:

- **researchdocuments**: Unstructured documents linked to projects

### API Endpoints

Base URL: `http://localhost:3000`
Swagger Docs: `http://localhost:3000/api`

#### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login (returns JWT token)

#### Projects (Requires Authentication)

- `GET /projects` - List all projects
- `POST /projects` - Create new project (Client only)
- `GET /projects/:id` - Get project details
- `PATCH /projects/:id` - Update project (Client only)
- `DELETE /projects/:id` - Delete project (Client only)

#### Vendors (Requires Authentication)

- `GET /vendors` - List all vendors
- `POST /vendors` - Create vendor (Admin only)
- `GET /vendors/:id` - Get vendor details
- `PATCH /vendors/:id` - Update vendor (Admin only)
- `DELETE /vendors/:id` - Delete vendor (Admin only)

#### Matches

- `POST /projects/:projectId/matches/rebuild` - Rebuild matches for a project
- `GET /projects/:projectId/matches` - Get matches for a project

#### Documents

- `POST /documents` - Upload research document
- `GET /documents/project/:projectId` - Get documents by project
- `POST /documents/search` - Search documents

#### Analytics (Admin only)

- `GET /analytics/top-vendors` - Top vendors per country with document counts
- `GET /analytics/expired-slas` - Vendors with expired SLAs

### Matching Algorithm

Score = (Services Overlap × 2) + Vendor Rating + SLA Weight

- Services Overlap: Number of matching services between project and vendor
- SLA Weight: 5 - (Response Hours / 24), capped at 0 minimum
- Vendors must support the project country

### Scheduled Jobs

- **Daily at Midnight**: Refresh matches for all active projects
- **Weekly**: Check and notify about expired SLAs (>72 hours)

### Local Development

```bash
# Install dependencies
npm install

# Start the application
npm run start:dev

# Run tests
npm run test

# Run tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e
```

Thought Process

    Installation steps
    Database setup/migrations
    Testing details
    Deployment instructions
    API Examples
    Contributing guidelines
    License
    Troubleshooting

# Run tests with coverage
    npm run test:cov

# Run e2e tests
    npm run test:e2e

# Clone the repository
    git clone https://github.com/yourusername/expanders360-api.git
    cd expanders360-api

# Install dependencies
    npm install

# Set up environment variables
    cp .env.example .env

# Run database migrations
    npm run migration:run

# Seed initial data (creates default admin user)
    npm run seed:run

# Start development server
    npm run start:dev

# Generate a new migration
    npm run migration:generate -- -n YourMigrationName

# Run pending migrations
    npm run migration:run

# Revert last migration
    npm run migration:revert
    
API Examples
Register a new client

    curl -X POST http://localhost:3000/auth/register \
      -H "Content-Type: application/json" \
      -d '{
        "email": "client@example.com",
        "password": "securepassword123",
        "role": "client",
        "companyName": "Tech Corp"
      }'

Login and get JWT token

    curl -X POST http://localhost:3000/auth/login \
      -H "Content-Type: application/json" \
      -d '{
        "email": "client@example.com",
        "password": "securepassword123"
      }'

Create a new project (with JWT token)

    curl -X POST http://localhost:3000/projects \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer YOUR_JWT_TOKEN" \
      -d '{
        "name": "US Market Expansion",
        "country": "United States",
        "services": ["Legal", "Accounting", "Marketing"],
        "timeline": "Q2 2024",
        "budget": 100000
      }'

Vercel Deployment

# Install Vercel CLI
    npm i -g vercel

# Deploy to production
    vercel --prod

Required Environment Variables

Set these in your production environment:

    # Application
    NODE_ENV=production
    PORT=3000

    # JWT
    JWT_SECRET=your-super-secret-jwt-key
    JWT_EXPIRATION=7d

    # MySQL Database
    MYSQL_HOST=your-mysql-host
    MYSQL_PORT=3306
    MYSQL_USERNAME=your-username
    MYSQL_PASSWORD=your-password
    MYSQL_DATABASE=your-database
    DATABASE_SSL=true

    # MongoDB
    MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

    # Email (Brevo SMTP)
    SMTP_HOST=smtp-relay.brevo.com
    SMTP_PORT=587
    SMTP_USER=your-smtp-user
    SMTP_PASSWORD=your-smtp-password
    SMTP_FROM=noreply@yourdomain.com

Docker Support

# Build and run with Docker Compose
    docker-compose up -d

# View logs
    docker-compose logs -f app

# Stop containers
    docker-compose down

Project Structure

    .
    ├── src/
    │   ├── auth/              # JWT authentication
    │   ├── users/             # User management
    │   ├── clients/           # Client companies
    │   ├── projects/          # Expansion projects
    │   ├── vendors/           # Service vendors
    │   ├── matches/           # Matching algorithm
    │   ├── documents/         # MongoDB documents
    │   ├── analytics/         # Analytics & reporting
    │   ├── notifications/     # Email notifications
    │   ├── scheduler/         # Cron jobs
    │   ├── database/          # Migrations & seeds
    │   └── config/            # Configuration
    ├── test/                  # Test files
    ├── api/                   # Vercel serverless functions
    └── dist/                  # Compiled output

Default Users

After running seeds, these users are available:

    Admin: admin@expanders360.com / admin123
    Client 1: client1@example.com / client123
    Client 2: client2@example.com / client123

Troubleshooting
Common Issues

    Database Connection Failed
        Check your MySQL/MongoDB credentials in .env
        Ensure database services are running
        For production, ensure SSL is properly configured

    JWT Authentication Errors
        Ensure JWT_SECRET is set in environment
        Check token format: Bearer <token>
        Verify token hasn't expired

    Build Errors on Vercel
        Ensure all environment variables are set in Vercel dashboard
        Check build logs for missing dependencies
        Verify vercel.json configuration

    CORS Issues
        CORS is enabled for all origins in development
        Configure specific origins for production in main.ts

Contributing

    Fork the repository
    Create your feature branch (git checkout -b feature/AmazingFeature)
    Commit your changes (git commit -m 'Add some AmazingFeature')
    Push to the branch (git push origin feature/AmazingFeature)
    Open a Pull Request

License

    This project is licensed under the UNLICENSED License - see the LICENSE file for details.
    Support

For support, email support@expanders360.com or open an issue in the GitHub repository.
