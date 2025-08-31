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
```
