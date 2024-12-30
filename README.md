# AI-Powered Customer Care Platform

# 📝 Description
Vultr T2 is an innovative customer care platform that combines AI-powered interactions with real-time video communication. The platform enables efficient task management, customer engagement, and sales representative support through an integrated system of dashboards and AI features.

# 🌟 Key Features
## 🤖 AI-Powered Task Management
####        Smart task creation with automated scripts
####        Data-driven customer assignment
####        Intelligent workload distribution

## 📊 Comprehensive Dashboard System
####        Admin control center for oversight
####        Representative workspace for task management
####        Real-time performance monitoring

## 🎥 Advanced Video Communication Suite
####        Agora-powered two-way video calls
####        Seamless customer-representative interactions
####        Professional meeting environment

## 🧠 Real-Time Intelligence Features
####        Live call transcription
####        AI-powered conversation hints
####        Keyword tracking and analysis

## 💬 Smart Support Infrastructure
####        GenAI-powered RAG chatbot
####        Call analysis and insights
####        Stored transcriptions for quality assurance 

# 🚀 Getting Started

## Prerequisites
####     PHP (Latest stable version)
####     Composer
####     Node.js and npm
####     MySQL 

## Vultr Account with:
####     Object Storage
####     Serverless Instance
####     MySQL Instance

# Installation
 
## Clone the repository
####     git clone https://github.com/barhatemanthan/vultr_t2.git

## Install AiCall dependencies
####     cd ./AiCall
####     npm i


## Install Chatbot dependencies
####     cd ./chatbot
####     npm i
####     composer install
####     php artisan install:api


## Install Server dependencies
####     cd ../server
####     npm i


## Install Backend dependencies
####     cd ../Backend
####     npm i


## Install Frontend dependencies
####     cd ../Frontend
####     npm i


## PHP & Laravel & Compose Configuration
####     Install PHP from official website
####     Download Composer
####     Create PHP configuration directory at C://Program Files//php-8.2.25
####     Configure php.ini - Enable pdo_mysql extension


# 💻 Usage
 
 
## Start all services concurrently
####     cd Frontend
####     npm run dev

# ⚙️ Configuration
Environment Variables .env
 
## Vultr Configuration
#####     VULTR_ENDPOINT=blr1.vultrobjects.com
#####     VULTR_ACCESS_KEY=your_access_key
#####     VULTR_SECRET_KEY=your_secret_key

## Storage Buckets
#####     task_bucket=taskdatabucket-3
#####     user_bucket=userdatabucket-3
#####     csv_bucket=csvuploadbucket-3

## Application Settings
#####     PORT=3000
#####     JWT_SECRET=your_jwt_secret


# 📚 API Documentation

## Node.js Backend Endpoints

#### Authentication
 
#####   POST /api/auth/signup - Register admin users
#####   POST /api/auth/signup-representative - Register representatives
#####   POST /api/auth/login - User authentication

## Admin Operations
 
#####   POST /api/admin/create-task - Create tasks
#####   GET /api/admin/tasks - Retrieve tasks
#####   GET /api/admin/representatives - List representatives
#####   POST /api/admin/upload-csv - Upload customer data

## Representative Operations
 
#####   GET /api/representative/assigned-tasks - Get assigned tasks

## Laravel Backend Endpoints
 
#####   POST /generate-token - Generate chat session token
#####   POST /send-message - Send chat messages
#####   GET /session-messages/{session_token} - Retrieve session messages

# 🤝 Contributing
####   Fork the repository
####   Create a feature branch
####   Commit your changes
####   Push to the branch
####   Open a Pull Request

# 📜 License
This project is licensed under the MIT License.

# 👥 Authors
####  Soham Mhatre - Github Profile
####  Manthan Barhate - GitHub Profile
####  Omkar Khoche - Github Profile

# 🙏 Acknowledgments
####  Vultr Cloud Services
####  Agora.io
####  Laravel Framework
####  React.js
####  Node.js

# 📞 Support
## For support and queries:

### Create an issue in the GitHub repository
### Contact the repository maintainers
