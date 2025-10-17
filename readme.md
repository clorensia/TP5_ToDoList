# 📝 ToDoList RESTful API

Aplikasi **ToDoList RESTful API** yang dibangun dengan Express.js dan MongoDB menggunakan clean code architecture. API ini menyediakan fitur lengkap untuk mengelola daftar tugas dengan sistem autentikasi berbasis JWT dan otorisasi yang ketat.

## 🎯 Fitur Utama

✅ **Authentication & Authorization**
- Registrasi dan login user
- JWT (JSON Web Token) untuk authentication
- Password hashing dengan bcryptjs
- Token expiration (7 hari)

✅ **Todo Management**
- CRUD operations (Create, Read, Update, Delete)
- Filter by status dan priority
- Sorting by createdAt, priority, atau dueDate
- Pagination support
- Overdue detection

✅ **Security**
- Helmet untuk HTTP security headers
- CORS protection
- Rate limiting
- Input validation
- User isolation (hanya bisa akses todo milik sendiri)

✅ **Code Quality**
- Clean architecture dengan separation of concerns
- Error handling yang comprehensive
- Structured logging
- Standardized API responses
- Input validation

## 🚀 Teknologi Stack

- **Runtime**: Node.js v16+
- **Framework**: Express.js v5.1.0
- **Database**: MongoDB dengan Mongoose v8.19.1
- **Authentication**: JWT (jsonwebtoken v9.0.2)
- **Security**: bcryptjs, Helmet, CORS, Rate Limiting
- **Logging**: Custom logger dengan file output
- **Deployment**: Vercel

## 📋 Prasyarat

- Node.js v16 atau lebih tinggi
- npm atau yarn
- MongoDB (local atau MongoDB Atlas cloud)

## ⚙️ Instalasi & Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd todolist-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Buat file `.env` di root directory:

```bash
cp .env.example .env
```

Edit `.env` dengan konfigurasi Anda:

```env
PORT=5000
NODE_ENV=development

# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/todolist

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=*

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Jalankan Server

**Development mode dengan hot reload:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server akan berjalan di `http://localhost:5000`

## 📁 Struktur Project

```
src/
├── config/
│   └── database.js              # Database connection
├── constants/
│   └── index.js                 # App constants & enums
├── controllers/
│   ├── authController.js        # Auth business logic
│   └── todoController.js        # Todo business logic
├── middleware/
│   ├── auth.js                  # JWT middleware
│   └── errorHandler.js          # Error handling
├── models/
│   ├── User.js                  # User schema
│   └── Todo.js                  # Todo schema
├── routes/
│   ├── auth.js                  # Auth endpoints
│   └── todos.js                 # Todo endpoints
├── utils/
│   ├── logger.js                # Logging utility
│   └── responseFormatter.js     # Response formatting
├── validators/
│   ├── authValidator.js         # Auth validation
│   └── todoValidator.js         # Todo validation
└── app.js                       # Express app config
```

## 🔐 API Endpoints

### Authentication

#### 1. Register User
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "statusCode": 201,
  "message": "User berhasil terdaftar",
  "data": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

#### 2. Login
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Login berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "username": "john_doe",
      "email": "john@example.com"
    }
  }
}
```

---

### Todo Management (Requires Authentication)

#### 3. Create Todo
**POST** `/api/todos`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Belajar Express.js",
  "description": "Membuat RESTful API dengan Express.js dan MongoDB",
  "priority": "high",
  "dueDate": "2024-12-31"
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "statusCode": 201,
  "message": "Todo berhasil dibuat",
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
    "title": "Belajar Express.js",
    "description": "Membuat RESTful API dengan Express.js dan MongoDB",
    "status": "pending",
    "priority": "high",
    "dueDate": "2024-12-31T00:00:00.000Z",
    "createdBy": "65a1b2c3d4e5f6g7h8i9j0k1",
    "isOverdue": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### 4. Get All Todos
**GET** `/api/todos`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters (Optional):**
- `status` - Filter by status (pending, in progress, completed)
- `priority` - Filter by priority (low, medium, high)
- `sortBy` - Sort by field (createdAt, priority, dueDate, status)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 50)

**Examples:**
```
GET /api/todos
GET /api/todos?status=pending
GET /api/todos?priority=high&sortBy=dueDate
GET /api/todos?status=completed&sortBy=createdAt
GET /api/todos?page=2&limit=20
```

**Response (200 OK):**
```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Data todo berhasil diambil",
  "data": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "title": "Belajar Express.js",
      "description": "Membuat RESTful API",
      "status": "pending",
      "priority": "high",
      "dueDate": "2024-12-31T00:00:00.000Z",
      "createdBy": "65a1b2c3d4e5f6g7h8i9j0k1",
      "isOverdue": false,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

#### 5. Get Todo Detail
**GET** `/api/todos/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Detail todo berhasil diambil",
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
    "title": "Belajar Express.js",
    "description": "Membuat RESTful API dengan Express.js dan MongoDB",
    "status": "pending",
    "priority": "high",
    "dueDate": "2024-12-31T00:00:00.000Z",
    "createdBy": "65a1b2c3d4e5f6g7h8i9j0k1",
    "isOverdue": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### 6. Update Todo
**PUT** `/api/todos/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body (Semua field optional):**
```json
{
  "title": "Belajar Express.js dan MongoDB",
  "description": "Membuat RESTful API yang lengkap",
  "status": "in progress",
  "priority": "medium",
  "dueDate": "2024-12-25"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Todo berhasil diubah",
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
    "title": "Belajar Express.js dan MongoDB",
    "description": "Membuat RESTful API yang lengkap",
    "status": "in progress",
    "priority": "medium",
    "dueDate": "2024-12-25T00:00:00.000Z",
    "createdBy": "65a1b2c3d4e5f6g7h8i9j0k1",
    "isOverdue": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:45:00.000Z"
  }
}
```

#### 7. Delete Todo
**DELETE** `/api/todos/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Todo berhasil dihapus",
  "data": null
}
```

#### 8. Delete All Todos
**DELETE** `/api/todos`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Semua todo berhasil dihapus",
  "data": {
    "deletedCount": 5
  }
}
```

---

### Health Check

#### 9. Check Server Status
**GET** `/api/health`

**Response (200 OK):**
```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Server is running",
  "data": {
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

## 📊 Response Format

Semua API responses menggunakan format yang konsisten:

**Success Response:**
```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Descriptive message",
  "data": {}
}
```

**Error Response:**
```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Error message",
  "details": ["field error 1", "field error 2"]
}
```

**Paginated Response:**
```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Data retrieved",
  "data": [],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

## 📌 HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request berhasil |
| 201 | Created - Resource berhasil dibuat |
| 400 | Bad Request - Invalid input/validation error |
| 401 | Unauthorized - Token missing/invalid/expired |
| 403 | Forbidden - User tidak berhak akses resource |
| 404 | Not Found - Resource tidak ditemukan |
| 409 | Conflict - Resource duplicate (email/username sudah ada) |
| 500 | Internal Server Error - Server error |

## 🔒 Security Features

✅ **JWT Authentication**
- Token-based authentication dengan JWT
- Token expiration (default 7 hari)
- Secure token verification

✅ **Password Security**
- Password hashing dengan bcryptjs (10 rounds salt)
- Password minimum 6 karakter
- Password tidak disimpan di response

✅ **Authorization**
- User hanya bisa akses todo milik mereka sendiri
- User isolation di setiap endpoint

✅ **Input Validation**
- Comprehensive validation untuk semua input
- Email format validation
- Enum validation untuk status & priority
- String length validation

✅ **HTTP Security**
- Helmet untuk security headers
- CORS protection
- Rate limiting (default 100 requests per 15 menit)
- Body size limitation (10kb)

## 🔐 Data Models

### User Schema
```javascript
{
  _id: ObjectId,
  username: String (3-30 chars, unique),
  email: String (unique, valid email format),
  password: String (hashed, min 6 chars),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Todo Schema
```javascript
{
  _id: ObjectId,
  title: String (required, max 200 chars),
  description: String (max 1000 chars),
  status: String (pending, in progress, completed),
  priority: String (low, medium, high),
  dueDate: Date (not in past),
  createdBy: ObjectId (ref: User),
  isOverdue: Boolean (virtual),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## 🧪 Testing dengan Postman

### 1. Setup Collection Variable
- Buat environment variable `token` untuk menyimpan JWT token

### 2. Register User
```
POST http://localhost:5000/api/auth/register
Body (JSON):
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

### 3. Login
```
POST http://localhost:5000/api/auth/login
Body (JSON):
{
  "email": "test@example.com",
  "password": "password123"
}
Response: Copy token ke postman environment variable
```

### 4. Create Todo
```
POST http://localhost:5000/api/todos
Header: Authorization: Bearer {{token}}
Body (JSON):
{
  "title": "Test Todo",
  "description": "Test description",
  "priority": "high"
}
```

### 5. Get All Todos
```
GET http://localhost:5000/api/todos?status=pending&sortBy=dueDate
Header: Authorization: Bearer {{token}}
```

## 🚀 Deployment ke Vercel

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Login ke Vercel
```bash
vercel login
```

### 3. Deploy Project
```bash
vercel
```

### 4. Setup Environment Variables di Vercel Dashboard

1. Buka project di Vercel dashboard
2. Go to Settings → Environment Variables
3. Add the following variables:
   - `MONGODB_URI` = Your MongoDB Atlas connection string
   - `JWT_SECRET` = Generate with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
   - `NODE_ENV` = production
   - `CORS_ORIGIN` = Your frontend URL (or *)
   - `RATE_LIMIT_WINDOW_MS` = 900000
   - `RATE_LIMIT_MAX_REQUESTS` = 100

### 5. Redeploy setelah Environment Setup
```bash
vercel --prod
```

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development / production |
| MONGODB_URI | MongoDB connection string | mongodb+srv://user:pass@cluster.mongodb.net/db |
| JWT_SECRET | JWT secret key | long_random_string_64_chars |
| JWT_EXPIRES_IN | Token expiration | 7d |
| CORS_ORIGIN | Allowed origins | * or http://localhost:3000 |
| RATE_LIMIT_WINDOW_MS | Rate limit window | 900000 (15 menit) |
| RATE_LIMIT_MAX_REQUESTS | Max requests per window | 100 |

## 📦 NPM Scripts

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
```

## 🗂️ File Structure Explanation

### `/src/config/database.js`
Menangani koneksi MongoDB dan event handling

### `/src/constants/index.js`
Menyimpan semua konstanta aplikasi untuk consistency

### `/src/controllers/`
Business logic untuk setiap feature (auth & todo)

### `/src/middleware/`
Auth verification dan global error handling

### `/src/models/`
Mongoose schemas untuk User dan Todo

### `/src/routes/`
API endpoints definition

### `/src/utils/`
Helper functions (logger & response formatter)

### `/src/validators/`
Input validation logic

## 🧠 Clean Code Architecture

✅ **Separation of Concerns**
- Model: Database schema
- Controller: Business logic
- Route: Endpoint definition
- Middleware: Cross-cutting concerns
- Validator: Input validation
- Utils: Helper functions

✅ **DRY Principle**
- Reusable response formatter
- Centralized error handling
- Constants untuk avoid magic strings
- Validator utilities

✅ **Error Handling**
- Try-catch di setiap endpoint
- Centralized error handler
- Meaningful error messages
- Proper HTTP status codes

✅ **Logging**
- Structured logging dengan timestamp
- Log levels (info, warn, error, debug)
- File output untuk production
- Console output untuk development

## 🐛 Troubleshooting

### MongoDB Connection Error
- Pastikan MongoDB sudah running
- Check connection string di .env
- Verify MongoDB Atlas IP whitelist

### JWT Token Error
- Pastikan JWT_SECRET di-set di environment
- Check token format di header (Bearer <token>)
- Verify token belum expired

### Rate Limiting Error
- Gunakan X-Forwarded-For header di production (untuk proxy)
- Adjust RATE_LIMIT_MAX_REQUESTS jika perlu

### CORS Error
- Pastikan CORS_ORIGIN di-set sesuai dengan client URL
- Atau set ke * untuk allow semua origin

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Documentation](https://jwt.io/)

## 📞 Support & Contact

Untuk pertanyaan atau issue, silakan buat issue di repository atau hubungi developer.

## 📄 License

MIT License - Feel free to use this project