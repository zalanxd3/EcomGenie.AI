# Integration Guide for EcomGenie.AI

## Quick Start

### Prerequisites
- Node.js 16+
- PostgreSQL 13+
- Redis 7+
- OpenAI API key

## Platform Integrations

### Shopify Integration

#### Setup Steps

1. **Get Shopify Credentials**
   - Go to Shopify Admin > Settings > Apps and integrations
   - Click "Develop apps"
   - Create new app and generate API credentials
   - Copy "Access Token" and "Shop Name"

2. **Connect to EcomGenie.AI**
   ```bash
   curl -X POST http://localhost:3000/api/v1/stores \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "storeType": "shopify",
       "storeName": "My Shopify Store",
       "credentials": {
         "shopName": "mystore",
         "accessToken": "shpat_..."
       }
     }'
   ```

3. **Verify Connection**
   - The system will test the connection
   - Store will be added to your account
   - Webhooks will be created automatically

### WooCommerce Integration

#### Setup Steps

1. **Generate REST API Keys**
   - Go to WordPress Admin > WooCommerce > Settings > Advanced > REST API
   - Click "Create an API key"
   - Set permissions to "Read/Write"
   - Copy Consumer Key and Consumer Secret

2. **Connect to EcomGenie.AI**
   ```bash
   curl -X POST http://localhost:3000/api/v1/stores \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "storeType": "woocommerce",
       "storeName": "My WooCommerce Store",
       "credentials": {
         "storeUrl": "https://mystore.com",
         "consumerKey": "ck_...",
         "consumerSecret": "cs_..."
       }
     }'
   ```

### Custom Platform Integration

#### Setup Steps

1. **Prepare API Details**
   - API endpoint URL
   - API key or authentication credentials
   - API documentation

2. **Connect to EcomGenie.AI**
   ```bash
   curl -X POST http://localhost:3000/api/v1/stores \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "storeType": "custom",
       "storeName": "My Custom Store",
       "credentials": {
         "apiUrl": "https://api.myplatform.com",
         "apiKey": "your_api_key"
       }
     }'
   ```

## Feature Integration

### Content Generation

#### Generate Product Description
```bash
curl -X POST http://localhost:3000/api/v1/content/generate-description \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Blue Cotton T-Shirt",
    "category": "Clothing",
    "features": ["100% organic cotton", "Machine washable"],
    "price": 29.99
  }'
```

#### Generate Product Titles
```bash
curl -X POST http://localhost:3000/api/v1/content/generate-title \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Blue Cotton T-Shirt",
    "category": "Clothing",
    "features": ["100% organic cotton", "Machine washable"]
  }'
```

#### Optimize Product Listing
```bash
curl -X POST http://localhost:3000/api/v1/content/optimize-listing \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Blue T-Shirt",
    "description": "A blue shirt made of cotton",
    "category": "Clothing",
    "price": 29.99
  }'
```

### Cart Recovery

#### Create Recovery Campaign
```bash
curl -X POST http://localhost:3000/api/v1/campaigns \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "storeId": "store-id-here",
    "campaignName": "Spring Cart Recovery",
    "campaignType": "abandoned-cart",
    "config": {
      "discountPercent": 15,
      "emailTemplate": "default"
    }
  }'
```

## Troubleshooting

### Connection Issues
- Verify API keys are correct
- Check network connectivity
- Ensure CORS is properly configured

### Rate Limiting
- API has rate limits: 100 requests per 15 minutes
- Implement exponential backoff in your client

### Content Generation
- Ensure OpenAI API key is set
- Check token usage in OpenAI dashboard
- Provide complete product information
