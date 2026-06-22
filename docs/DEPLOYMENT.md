# Deployment Guide

## Local Development

### Prerequisites
- Node.js 16+
- PostgreSQL 13+
- Redis 7+
- Git

### Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/zalanxd3/EcomGenie.AI.git
   cd EcomGenie.AI
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Setup Database**
   ```bash
   psql -U postgres -c "CREATE DATABASE ecomgenie_ai"
   psql -U postgres -d ecomgenie_ai < src/database/schema.sql
   ```

5. **Start Services**
   ```bash
   npm run dev
   ```
   API will be available at `http://localhost:3000`

## Docker Compose (Recommended)

### Prerequisites
- Docker
- Docker Compose

### Setup

1. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

2. **Start All Services**
   ```bash
   docker-compose up -d
   ```

3. **Verify Services**
   ```bash
   docker-compose ps
   curl http://localhost:3000/health
   ```

4. **View Logs**
   ```bash
   docker-compose logs -f api
   ```

5. **Stop Services**
   ```bash
   docker-compose down
   ```

## Production Deployment

### AWS ECS Fargate

1. **Build and Push Image**
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_AWS_ID.dkr.ecr.us-east-1.amazonaws.com
   docker build -t ecomgenie:latest .
   docker tag ecomgenie:latest YOUR_AWS_ID.dkr.ecr.us-east-1.amazonaws.com/ecomgenie:latest
   docker push YOUR_AWS_ID.dkr.ecr.us-east-1.amazonaws.com/ecomgenie:latest
   ```

2. **Create ECS Task Definition**
   - Configure container image from ECR
   - Set environment variables
   - Configure logging to CloudWatch

3. **Create ECS Service**
   - Use Application Load Balancer
   - Configure auto-scaling
   - Set desired task count

4. **Database Setup**
   - Use AWS RDS PostgreSQL
   - Configure security groups
   - Enable automated backups

5. **Redis Setup**
   - Use AWS ElastiCache
   - Configure subnet groups
   - Enable encryption

### Google Cloud Run

1. **Build Image**
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT_ID/ecomgenie
   ```

2. **Deploy Service**
   ```bash
   gcloud run deploy ecomgenie \
     --image gcr.io/PROJECT_ID/ecomgenie \
     --platform managed \
     --region us-central1 \
     --set-env-vars NODE_ENV=production,JWT_SECRET=YOUR_SECRET
   ```

### Kubernetes

1. **Create Namespace**
   ```bash
   kubectl create namespace ecomgenie
   ```

2. **Create ConfigMap and Secrets**
   ```bash
   kubectl create configmap ecomgenie-config --from-file=.env -n ecomgenie
   kubectl create secret generic ecomgenie-secrets --from-literal=JWT_SECRET=YOUR_SECRET -n ecomgenie
   ```

3. **Deploy Resources**
   ```bash
   kubectl apply -f k8s/postgres.yaml -n ecomgenie
   kubectl apply -f k8s/redis.yaml -n ecomgenie
   kubectl apply -f k8s/api-deployment.yaml -n ecomgenie
   kubectl apply -f k8s/service.yaml -n ecomgenie
   ```

## SSL/TLS Configuration

### Let's Encrypt with Nginx

1. **Install Certbot**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   ```

2. **Generate Certificate**
   ```bash
   sudo certbot certonly --nginx -d api.ecomgenie.com
   ```

3. **Configure Nginx**
   ```nginx
   server {
       listen 443 ssl http2;
       server_name api.ecomgenie.com;
       
       ssl_certificate /etc/letsencrypt/live/api.ecomgenie.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/api.ecomgenie.com/privkey.pem;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Monitoring & Logging

### Application Logs
```bash
# Docker Compose
docker-compose logs -f api

# Local
tail -f logs/combined.log
```

### Health Checks
```bash
curl http://localhost:3000/health
```

### Performance Monitoring
- CloudWatch (AWS)
- Stackdriver (Google Cloud)
- New Relic
- DataDog

## Backup & Recovery

### Database Backup
```bash
pg_dump -h localhost -U postgres ecomgenie_ai > backup.sql
```

### Database Restore
```bash
psql -h localhost -U postgres ecomgenie_ai < backup.sql
```

### Redis Backup
```bash
redis-cli BGSAVE
```
