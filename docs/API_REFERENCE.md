# API Reference - EcomGenie.AI

## Base URL
```
https://api.ecomgenie.com/api/v1
```

## Authentication

All requests require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Authentication Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe"
}

Response: 201 Created
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "created_at": "2024-01-20T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}

Response: 200 OK
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

## Store Endpoints

### Connect Store
```http
POST /stores
Content-Type: application/json
Authorization: Bearer <token>

{
  "storeType": "shopify",
  "storeName": "My Store",
  "credentials": {
    "shopName": "mystore",
    "accessToken": "shpat_..."
  }
}

Response: 201 Created
{
  "message": "Store connected successfully",
  "store": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": 1,
    "store_type": "shopify",
    "store_name": "My Store",
    "created_at": "2024-01-20T10:30:00Z"
  }
}
```

### List Stores
```http
GET /stores
Authorization: Bearer <token>

Response: 200 OK
{
  "stores": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "user_id": 1,
      "store_type": "shopify",
      "store_name": "My Store",
      "created_at": "2024-01-20T10:30:00Z"
    }
  ]
}
```

## Content Generation Endpoints

### Generate Product Description
```http
POST /content/generate-description
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Wireless Headphones",
  "category": "Electronics",
  "features": ["Noise cancellation", "30-hour battery", "Bluetooth 5.0"],
  "price": 199.99,
  "targetAudience": "Tech enthusiasts"
}

Response: 200 OK
{
  "description": "Experience premium audio with our Wireless Headphones..."
}
```

### Generate Product Titles
```http
POST /content/generate-title
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Wireless Headphones",
  "category": "Electronics",
  "features": ["Noise cancellation", "30-hour battery"]
}

Response: 200 OK
{
  "titles": [
    "Premium Wireless Headphones with Active Noise Cancellation",
    "Wireless Headphones | 30-Hour Battery Life | Bluetooth 5.0",
    "Professional Wireless Headphones for Music Lovers"
  ]
}
```

### Optimize Product Listing
```http
POST /content/optimize-listing
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Headphones",
  "description": "Good headphones",
  "category": "Electronics",
  "price": 199.99
}

Response: 200 OK
{
  "optimization": {
    "optimized_title": "Premium Wireless Headphones with Noise Cancellation",
    "optimization_suggestions": ["Add key features to title", "Include technical specs"],
    "recommended_keywords": ["wireless headphones", "noise canceling"],
    "conversion_score": 8,
    "reasoning": "Well-structured with improvement opportunities"
  }
}
```

## Campaign Endpoints

### Create Campaign
```http
POST /campaigns
Content-Type: application/json
Authorization: Bearer <token>

{
  "storeId": "550e8400-e29b-41d4-a716-446655440000",
  "campaignName": "Summer Sale",
  "campaignType": "abandoned-cart",
  "config": {
    "discountPercent": 10,
    "emailTemplate": "default"
  }
}

Response: 201 Created
{
  "message": "Campaign created successfully",
  "campaign": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "store_id": "550e8400-e29b-41d4-a716-446655440000",
    "campaign_name": "Summer Sale",
    "campaign_type": "abandoned-cart",
    "status": "active",
    "created_at": "2024-01-20T10:30:00Z"
  }
}
```

### Get Campaign Metrics
```http
GET /campaigns/{campaignId}/metrics
Authorization: Bearer <token>

Response: 200 OK
{
  "metrics": {
    "total_sent": 1250,
    "opened": 487,
    "clicked": 156,
    "converted": 45,
    "total_revenue": 2450.00
  }
}
```

## Analytics Endpoints

### Get Dashboard Analytics
```http
GET /analytics/dashboard/{storeId}
Authorization: Bearer <token>

Response: 200 OK
{
  "analytics": {
    "total_campaigns": 5,
    "active_campaigns": 3,
    "total_revenue": 12450.00,
    "avg_open_rate": 38.9,
    "avg_click_rate": 12.5
  }
}
```

### Get Cart Recovery Metrics
```http
GET /analytics/cart-recovery/{storeId}
Authorization: Bearer <token>

Response: 200 OK
{
  "metrics": {
    "total_abandoned": 450,
    "recovered_count": 127,
    "recovery_rate": 28.22,
    "total_potential_revenue": 15680.00
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request format"
}
```

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error"
}
```
