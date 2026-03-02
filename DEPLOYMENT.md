# Mesh Reality 3D Generation System Deployment Guide

This guide provides instructions for deploying the Mesh Reality 3D Generation system, which consists of three main components:

1. **Frontend Website** (Next.js)
2. **Backend API** (Express.js)
3. **Python Job Processor** (Hunyuan3D)

## Prerequisites

- Node.js 18.x or later
- Python 3.8 or later
- MySQL database
- AWS S3 bucket
- Firebase project

## 1. Database Setup

### 1.1 Create Database

```sql
CREATE DATABASE mesh_reality;
```

### 1.2 Configure Access

Ensure your database user has appropriate permissions:

```sql
GRANT ALL PRIVILEGES ON mesh_reality.* TO 'your_user'@'%';
FLUSH PRIVILEGES;
```

## 2. Backend API Deployment

### 2.1 Clone Repository

```bash
git clone https://github.com/your-org/mesh-reality-backend.git
cd mesh-reality-backend
```

### 2.2 Install Dependencies

```bash
npm install
```

### 2.3 Configure Environment Variables

Create a `.env` file:

```
# Database Configuration
DATABASE_URL=mysql://user:password@host:port/mesh_reality

# Firebase Admin Config
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY="your-private-key"

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET=3dgeneration
```

### 2.4 Run Database Migrations

```bash
npx prisma migrate deploy
```

### 2.5 Build and Start

```bash
npm run build
npm start
```

For production, consider using a process manager like PM2:

```bash
npm install -g pm2
pm2 start npm --name "mesh-reality-backend" -- start
pm2 save
```

## 3. Python Job Processor Deployment

### 3.1 Clone Repository

```bash
git clone https://github.com/your-org/mesh-reality-hunyuan3d.git
cd mesh-reality-hunyuan3d
```

### 3.2 Install Dependencies

```bash
pip install -r requirements.txt
```

Or install individual packages:

```bash
pip install mysql-connector-python boto3 pillow numpy pyrender trimesh imageio
```

### 3.3 Configure Environment Variables

Create a `.env` file:

```
# Database Configuration
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=mesh_reality

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

### 3.4 Set Up as a Service

For Linux systems, create a systemd service:

```bash
sudo nano /etc/systemd/system/mesh-reality-job-processor.service
```

Add the following content:

```ini
[Unit]
Description=Mesh Reality Hunyuan3D Job Processor
After=network.target

[Service]
User=your_user
WorkingDirectory=/path/to/mesh-reality-hunyuan3d
ExecStart=/usr/bin/python3 db_job_processor.py
Restart=always
Environment=DB_HOST=your_db_host
Environment=DB_USER=your_db_user
Environment=DB_PASSWORD=your_db_password
Environment=DB_NAME=mesh_reality
Environment=AWS_ACCESS_KEY_ID=your_aws_access_key
Environment=AWS_SECRET_ACCESS_KEY=your_aws_secret_key

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl enable mesh-reality-job-processor
sudo systemctl start mesh-reality-job-processor
```

## 4. Frontend Website Deployment

### 4.1 Clone Repository

```bash
git clone https://github.com/your-org/mesh-reality-website.git
cd mesh-reality-website
```

### 4.2 Install Dependencies

```bash
npm install
```

### 4.3 Configure Environment Variables

Create a `.env.local` file:

```
# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend-api.com
NEXT_PUBLIC_SWIFT_API_URL=http://your-swift-api.com
NEXT_PUBLIC_SWIFT_WS_URL=ws://your-swift-api.com

# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase Admin Config
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY="your-private-key"

# NextAuth Config
NEXTAUTH_URL=https://your-website.com
NEXTAUTH_SECRET=your-nextauth-secret

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
APPLE_ID=your-apple-id
APPLE_SECRET=your-apple-secret
```

### 4.4 Build and Start

For development:

```bash
npm run dev
```

For production:

```bash
npm run build
npm start
```

### 4.5 Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

## 5. AWS S3 Configuration

### 5.1 Create Bucket

1. Go to the AWS S3 console
2. Create a new bucket named `3dgeneration`
3. Configure bucket settings:
   - Enable public access (for model and preview URLs)
   - Enable CORS for your domains

### 5.2 CORS Configuration

Add the following CORS configuration to your S3 bucket:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET"],
    "AllowedOrigins": ["https://your-website.com"],
    "ExposeHeaders": []
  }
]
```

### 5.3 IAM User

Create an IAM user with the following permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::3dgeneration",
        "arn:aws:s3:::3dgeneration/*"
      ]
    }
  ]
}
```

## 6. Monitoring and Maintenance

### 6.1 Backend API Monitoring

```bash
pm2 monit
pm2 logs mesh-reality-backend
```

### 6.2 Python Job Processor Monitoring

```bash
sudo systemctl status mesh-reality-job-processor
sudo journalctl -u mesh-reality-job-processor
```

### 6.3 Database Backups

Set up automated backups for your MySQL database:

```bash
mysqldump -u your_user -p mesh_reality > backup_$(date +%Y%m%d).sql
```

### 6.4 Log Rotation

Configure log rotation for your application logs:

```bash
sudo nano /etc/logrotate.d/mesh-reality
```

Add the following content:

```
/var/log/mesh-reality/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
}
```

## 7. Troubleshooting

### 7.1 Backend API Issues

- Check logs: `pm2 logs mesh-reality-backend`
- Verify database connection: `mysql -u your_user -p -h your_host mesh_reality`
- Check environment variables: `pm2 env 0`

### 7.2 Python Job Processor Issues

- Check logs: `sudo journalctl -u mesh-reality-job-processor`
- Verify database connection: `python -c "import mysql.connector; conn = mysql.connector.connect(host='your_host', user='your_user', password='your_password', database='mesh_reality'); print('Connected!')" `
- Check environment variables: `sudo systemctl show -p Environment mesh-reality-job-processor`

### 7.3 Frontend Issues

- Check browser console for errors
- Verify API connectivity: `curl https://your-backend-api.com/api/health`
- Check environment variables in Vercel dashboard

## 8. Scaling Considerations

### 8.1 Backend API

- Deploy multiple instances behind a load balancer
- Use a connection pool for database connections
- Consider using Redis for caching

### 8.2 Python Job Processor

- Deploy multiple instances on different servers
- Implement a distributed lock mechanism to prevent job duplication
- Consider using a message queue (RabbitMQ, SQS) for job distribution

### 8.3 Database

- Set up read replicas for read-heavy operations
- Consider sharding for very large datasets
- Implement proper indexing for job and model tables

## 9. Security Considerations

### 9.1 API Security

- Implement rate limiting
- Use HTTPS for all endpoints
- Validate all input data
- Implement proper authentication and authorization

### 9.2 S3 Security

- Use pre-signed URLs for temporary access
- Implement proper bucket policies
- Enable server-side encryption

### 9.3 Database Security

- Use strong passwords
- Restrict network access
- Enable SSL for database connections
- Regularly update and patch the database server
