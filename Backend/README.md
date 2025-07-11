# CustomCare Backend API Documentation

## Overview
CustomCare is a comprehensive customer management and task assignment system that enables administrators to create and manage tasks, upload customer data, generate AI-powered scripts, and assign work to representatives. The system features role-based authentication and AI integration with Mistral AI for script and keyword generation.

## Technology Stack
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **AI Integration**: Mistral AI for script generation
- **File Processing**: CSV parsing with multer
- **Security**: bcrypt for password hashing

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or remote instance)
- Mistral AI API Key

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```env
   MONGODB_URI=mongodb://localhost:27017/customcare
   JWT_SECRET=your_jwt_secret_key
   PORT=3000
   MISTRAL_API_KEY=your_mistral_api_key
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

## Base URL
```
http://localhost:3000
```

## Authentication
The API uses JWT tokens for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <token>
```

For AI-powered endpoints, include the Mistral API key:
```
genai-auth: <mistral_api_key>
```

---

## API Endpoints

### 🔐 Authentication Routes (`/api/auth`)

#### 1. Admin Signup
**Endpoint**: `POST /api/auth/signup`

**Description**: Register a new admin user

**Request Body**:
```json
{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "securePassword123",
  "role": "Admin"
}
```

**Response**:
```json
{
  "message": "User signed up successfully"
}
```

**Status Codes**:
- `201`: User created successfully
- `400`: User already exists
- `500`: Server error

---

#### 2. Representative Signup
**Endpoint**: `POST /api/auth/signup-representative`

**Description**: Register a new representative user

**Request Body**:
```json
{
  "name": "Representative Name",
  "email": "rep@example.com",
  "password": "securePassword123",
  "operations": ["GPU", "CPU", "LLM"]
}
```

**Response**:
```json
{
  "message": "Representative signed up successfully"
}
```

**Status Codes**:
- `201`: Representative created successfully
- `500`: Server error

---

#### 3. User Login
**Endpoint**: `POST /api/auth/login`

**Description**: Authenticate user and receive JWT token

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "userPassword123"
}
```

**Response**:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "username": "User Name",
    "email": "user@example.com",
    "role": "Admin"
  }
}
```

**Status Codes**:
- `200`: Login successful
- `400`: Invalid credentials
- `500`: Server error

---

### 👑 Admin Routes (`/api/admin`)

#### 1. Create Task
**Endpoint**: `POST /api/admin/create-task`

**Description**: Create a new task and assign it to representatives

**Headers**:
```
Content-Type: application/json
Authorization: Bearer <token> (currently optional)
```

**Request Body**:
```json
{
  "category": "GPU",
  "customers": [
    {
      "id": "cust_001",
      "name": "John Doe",
      "email": "john@example.com",
      "productDemand": "High-Performance GPU"
    }
  ],
  "projectTitle": "GPU Sales Campaign Q1",
  "description": "Reach out to customers interested in GPU solutions",
  "script": "Generated sales script content...",
  "keywords": "performance, gaming, AI training",
  "assignedMembers": [
    {
      "name": "Rep Name",
      "email": "rep@example.com",
      "skillset": ["GPU", "Sales"]
    }
  ],
  "status": "pending",
  "priority": "high",
  "assignedDate": "2025-05-30T00:00:00.000Z",
  "dueDate": "2025-06-15T00:00:00.000Z"
}
```

**Response**:
```json
{
  "message": "Task created and assigned successfully",
  "taskId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Status Codes**:
- `201`: Task created successfully
- `400`: Missing required fields
- `500`: Server error

---

#### 2. Get Representatives
**Endpoint**: `GET /api/admin/representatives`

**Description**: Fetch all available representatives

**Headers**:
```
Authorization: Bearer <token> (currently optional)
```

**Response**:
```json
[
  {
    "name": "John Smith",
    "email": "john.smith@company.com",
    "skillset": ["GPU", "CPU"],
    "status": "Available"
  },
  {
    "name": "Jane Doe",
    "email": "jane.doe@company.com",
    "skillset": ["LLM", "AI"],
    "status": "Available"
  }
]
```

**Status Codes**:
- `200`: Representatives fetched successfully
- `500`: Server error

---

#### 3. Get All Tasks
**Endpoint**: `GET /api/admin/tasks`

**Description**: Fetch all tasks in the system

**Headers**:
```
Authorization: Bearer <token> (currently optional)
```

**Response**:
```json
[
  {
    "taskId": "550e8400-e29b-41d4-a716-446655440000",
    "category": "GPU",
    "customers": [...],
    "projectTitle": "GPU Sales Campaign Q1",
    "description": "Reach out to customers interested in GPU solutions",
    "script": "Generated sales script...",
    "keywords": "performance, gaming, AI training",
    "assignedMembers": [...],
    "status": "pending",
    "priority": "high",
    "assignedDate": "2025-05-30T00:00:00.000Z",
    "dueDate": "2025-06-15T00:00:00.000Z",
    "createdAt": "2025-05-30T10:30:00.000Z",
    "updatedAt": "2025-05-30T10:30:00.000Z"
  }
]
```

**Status Codes**:
- `200`: Tasks fetched successfully
- `500`: Server error

---

#### 4. Upload CSV
**Endpoint**: `POST /api/admin/upload-csv`

**Description**: Upload customer data via CSV file

**Headers**:
```
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

**Request Body** (Form Data):
```
file: <CSV file>
```

**CSV Format**:
```csv
id,name,productDemand,category,email
cust_001,John Doe,High-Performance GPU,GPU,john.doe@example.com
cust_002,Jane Smith,Multi-GPU Setup,GPU,jane.smith@example.com
```

**Response**:
```json
{
  "message": "CSV uploaded and processed successfully",
  "data": [
    {
      "id": "cust_001",
      "name": "John Doe",
      "productDemand": "High-Performance GPU",
      "category": "GPU",
      "email": "john.doe@example.com"
    }
  ]
}
```

**Status Codes**:
- `201`: CSV uploaded successfully
- `400`: No file uploaded
- `500`: Server error

---

#### 5. Get Customer Data
**Endpoint**: `GET /api/admin/customers`

**Description**: Retrieve customer data from uploaded CSV

**Headers**:
```
Authorization: Bearer <token> (currently optional)
```

**Query Parameters**:
```
filename: customers_gpu.csv (required)
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "cust_001",
      "name": "John Doe",
      "productDemand": "High-Performance GPU for AI Training",
      "category": "GPU",
      "email": "john.doe@example.com"
    }
  ]
}
```

**Error Response**:
```json
{
  "success": false,
  "message": "CSV file not found or no data available"
}
```

**Status Codes**:
- `200`: Data retrieved successfully
- `400`: Invalid filename or missing filename
- `404`: File not found
- `500`: Server error

---

#### 6. Generate Script (AI-Powered)
**Endpoint**: `POST /api/admin/generate-script`

**Description**: Generate sales script using Mistral AI based on customer description and task

**Headers**:
```
Content-Type: application/json
genai-auth: <mistral_api_key> (required)
```

**Request Body**:
```json
{
  "description": {
    "CustomerProfile": {
      "Demographic": "Tech enthusiast, age 25-40",
      "Lifestyle": "Gaming and content creation",
      "TechSavviness": "High"
    },
    "NeedsAndPainPoints": {
      "Desire": "High-performance graphics",
      "Need": "GPU for gaming and AI training",
      "Importance": "High priority",
      "Preference": "NVIDIA RTX series",
      "Budget": "$1000-$2000"
    },
    "PotentialProductPropositions": {
      "Product": "RTX 4080 Gaming GPU"
    }
  },
  "task": "Generate a personalized sales script for GPU products targeting gaming enthusiasts and AI developers."
}
```

**Response**:
```json
{
  "script": "Hello! I understand you're looking for a high-performance GPU solution. Based on your interest in both gaming and AI training, I'd like to introduce you to our RTX 4080 series. This GPU offers exceptional performance for 4K gaming while providing the CUDA cores needed for machine learning workflows. With your budget range of $1000-$2000, this represents excellent value for both your gaming passion and professional AI development needs. Would you like to learn more about the specific configurations available?"
}
```

**Status Codes**:
- `200`: Script generated successfully
- `400`: Missing description or task
- `401`: Invalid Mistral API key
- `500`: AI service error

---

#### 7. Generate Keywords (AI-Powered)
**Endpoint**: `POST /api/admin/generate-keywords`

**Description**: Extract keywords from generated script using Mistral AI

**Headers**:
```
Content-Type: application/json
genai-auth: <mistral_api_key> (required)
```

**Request Body**:
```json
{
  "script": "Hello! I understand you're looking for a high-performance GPU solution...",
  "task": "Extract personal and product keywords from this sales script for customer segmentation and targeting."
}
```

**Response**:
```json
{
  "personal Keywords": "tech enthusiast, gaming passion, AI developer, professional, budget-conscious",
  "product keywords": "RTX 4080, high-performance, CUDA cores, 4K gaming, machine learning, value proposition"
}
```

**Status Codes**:
- `200`: Keywords generated successfully
- `400`: Missing script or task
- `401`: Invalid Mistral API key
- `500`: AI service error

---

### 👥 Representative Routes (`/api/representative`)

#### 1. Get Assigned Tasks
**Endpoint**: `GET /api/representative/assigned-tasks`

**Description**: Fetch tasks assigned to the authenticated representative

**Headers**:
```
Authorization: Bearer <token> (currently optional)
```

**Query Parameters**:
```
user.username: Representative Name (required)
```

**Response**:
```json
[
  {
    "category": "GPU",
    "taskId": "550e8400-e29b-41d4-a716-446655440000",
    "customers": [
      {
        "id": "cust_001",
        "name": "John Doe",
        "email": "john@example.com"
      }
    ],
    "projectTitle": "GPU Sales Campaign Q1",
    "description": "Reach out to customers interested in GPU solutions",
    "script": "Generated sales script content...",
    "keywords": "performance, gaming, AI training",
    "assignedMembers": [
      {
        "name": "Rep Name",
        "email": "rep@example.com",
        "skillset": ["GPU", "Sales"]
      }
    ],
    "status": "pending",
    "priority": "high",
    "assignedDate": "2025-05-30T00:00:00.000Z",
    "dueDate": "2025-06-15T00:00:00.000Z",
    "createdAt": "2025-05-30T10:30:00.000Z"
  }
]
```

**Status Codes**:
- `200`: Tasks retrieved successfully
- `500`: Server error

---

## Data Models

### User Model
```json
{
  "name": "string (required)",
  "email": "string (required, unique)",
  "password": "string (required, hashed)",
  "role": "Admin | Representative (required)",
  "operations": ["string"] // For representatives only
}
```

### Task Model
```json
{
  "taskId": "string (required, unique, UUID)",
  "category": "string (required)",
  "customers": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "productDemand": "string"
    }
  ],
  "projectTitle": "string (required)",
  "description": "string (required)",
  "script": "string (required)",
  "keywords": "string",
  "assignedMembers": [
    {
      "name": "string",
      "email": "string",
      "skillset": ["string"]
    }
  ],
  "status": "pending | in-progress | completed | cancelled",
  "priority": "low | medium | high | urgent",
  "assignedDate": "Date",
  "dueDate": "Date",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Customer Model
```json
{
  "id": "string (required)",
  "name": "string (required)",
  "productDemand": "string (required)",
  "category": "string (required)",
  "email": "string (required)",
  "filename": "string (required)"
}
```

## Error Handling

### Standard Error Response Format
```json
{
  "message": "Error description",
  "error": "Detailed error information (in development)"
}
```

### Common HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Security Features

### Authentication
- JWT token-based authentication
- Tokens expire in 1 hour
- Password hashing using bcrypt

### Authorization
- Role-based access control (Admin/Representative)
- Protected routes with middleware
- Mistral AI key validation for AI endpoints

### CORS Configuration
```javascript
{
  origin: 'http://localhost:5173',
  httpOnly: true,
  credentials: true
}
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT signing | Yes |
| `PORT` | Server port (default: 3000) | No |
| `MISTRAL_API_KEY` | Mistral AI API key | Yes (for AI features) |

## Sample Integration Code

### JavaScript/Node.js Example
```javascript
// Login and get token
const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'password123'
  })
});
const { token } = await loginResponse.json();

// Create a task
const taskResponse = await fetch('http://localhost:3000/api/admin/create-task', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    category: 'GPU',
    customers: [...],
    projectTitle: 'New Campaign',
    description: 'Campaign description',
    script: 'Sales script',
    assignedMembers: [...]
  })
});
```

### Python Example
```python
import requests

# Login
login_data = {
    "email": "admin@example.com",
    "password": "password123"
}
response = requests.post('http://localhost:3000/api/auth/login', json=login_data)
token = response.json()['token']

# Get representatives
headers = {"Authorization": f"Bearer {token}"}
reps = requests.get('http://localhost:3000/api/admin/representatives', headers=headers)
print(reps.json())
```

## Support

For integration support or API questions, please refer to the source code or contact the development team.

---

*Generated on: May 30, 2025*
*API Version: 1.0.0*