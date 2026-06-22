# EcomGenie.AI - System Architecture

## Overview

EcomGenie.AI is a comprehensive AI-powered platform for e-commerce businesses that provides intelligent content generation, abandoned cart recovery, and product listing optimization across multiple platforms.

## Architecture Diagram

```
┌──────────────────────────────────────────────────────┐
│           Client Applications                        │
│   (Web Dashboard, Mobile Apps, APIs)                │
└───────────────────────┬──────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
    ┌───▼────────┐  ┌──▼──────────┐  ┌─▼────────────┐
    │ Shopify    │  │ WooCommerce │  │ Custom API   │
    │ Connector  │  │ Connector   │  │ Connector    │
    └─────┬──────┘  └──────┬──────┘  └─────┬────────┘
          │                │               │
          └────────────────┼───────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
    ┌───▼──────────┐  ┌───▼──────────┐  ┌───▼──────────┐
    │ Content      │  │ Cart         │  │ Product      │
    │ Generation   │  │ Recovery     │  │ Optimization │
    │ Service      │  │ Service      │  │ Service      │
    └───┬──────────┘  └───┬──────────┘  └───┬──────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
    ┌───▼──────────┐  ┌───▼──────────┐  ┌───▼──────────┐
    │ PostgreSQL   │  │ Redis Cache  │  │ OpenAI API   │
    │ Database     │  │              │  │              │
    └──────────────┘  └──────────────┘  └──────────────┘
```

## Core Components

### 1. **API Layer**
- RESTful API endpoints
- JWT authentication
- Rate limiting
- Request validation
- Comprehensive error handling

### 2. **Service Layer**

#### Content Generation Service
- AI-powered product description generation
- SEO-optimized titles
- Social media content creation
- Keyword optimization

#### Cart Recovery Service
- Abandoned cart detection
- Personalized email generation
- Recovery campaign management
- Metrics tracking

#### Product Optimization Service
- Listing optimization analysis
- Keyword research and suggestions
- Bulk product optimization
- Performance scoring

### 3. **Integration Layer**

#### Platform Connectors
- **Shopify**: OAuth, product sync, order management
- **WooCommerce**: REST API integration, custom taxonomy
- **Custom Platforms**: Flexible REST API client

### 4. **Data Layer**

#### PostgreSQL
- User management
- Store configurations
- Products catalog
- Campaign tracking
- Analytics data

#### Redis
- Session management
- Caching layer
- Rate limiting
- Job queues

## Database Schema

### Key Tables

```sql
users - User accounts and authentication
stores - Connected e-commerce stores
products - Product catalog
abandoned_carts - Abandoned cart tracking
campaigns - Marketing campaigns
campaign_emails - Email tracking and metrics
content_suggestions - AI-generated suggestions
```

## API Endpoints

### Authentication
```
POST /api/v1/auth/register
POST /api/v1/auth/login
```

### Store Management
```
POST /api/v1/stores
GET /api/v1/stores
GET /api/v1/stores/:storeId
```

### Content Generation
```
POST /api/v1/content/generate-description
POST /api/v1/content/generate-title
POST /api/v1/content/generate-social
POST /api/v1/content/optimize-listing
```

### Campaigns
```
POST /api/v1/campaigns
GET /api/v1/campaigns/:storeId
GET /api/v1/campaigns/:campaignId/metrics
```

### Analytics
```
GET /api/v1/analytics/dashboard/:storeId
GET /api/v1/analytics/cart-recovery/:storeId
```

## Security Architecture

### Authentication & Authorization
- JWT tokens for API authentication
- Role-based access control (RBAC)
- API key management
- Encrypted password storage (bcrypt)

### Data Protection
- HTTPS/TLS for all communications
- Environment variables for secrets
- Database encryption
- SQL injection prevention

### API Security
- Rate limiting
- CORS configuration
- Input validation (Joi schemas)
- Comprehensive error handling

## Scalability

### Horizontal Scaling
- Stateless API design
- Redis for distributed caching
- Database connection pooling
- Load balancer ready

### Performance Optimization
- Database indexing
- Redis caching
- Query optimization
- Async job processing

## Deployment Architecture

### Docker Containerization
- Multi-container setup
- Environment-based configuration
- Health checks
- Volume management

### Supported Deployment Options
- Docker Compose (Development)
- Kubernetes (Production)
- AWS ECS/Fargate
- Google Cloud Run
- Azure Container Instances
