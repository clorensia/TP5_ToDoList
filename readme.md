# 📝 ToDoList RESTful API

Aplikasi ToDoList RESTful API yang dibangun dengan Express.js dan MongoDB. API ini menyediakan fitur lengkap untuk mengelola daftar tugas dengan sistem autentikasi berbasis JWT dan otorisasi yang ketat.

## 🌐 API Live

**Akses API:** https://todo-backend-git-main-clorensias-projects.vercel.app/

**Postman Collection:** https://documenter.getpostman.com/view/49308345/2sB3QNr9Kn

---

## ✨ Fitur Utama

- ✅ Registrasi dan login pengguna dengan JWT
- ✅ CRUD lengkap untuk todo (Create, Read, Update, Delete)
- ✅ Filter dan sorting berdasarkan status dan prioritas
- ✅ Pagination untuk dataset besar
- ✅ Validasi input comprehensive
- ✅ Error handling yang proper
- ✅ Sistem logging terstruktur
- ✅ Security best practices (bcrypt, rate limiting, helmet, CORS)

---

## 🚀 Teknologi yang Digunakan

- **Runtime:** Node.js v16+
- **Framework:** Express.js v5.1.0
- **Database:** MongoDB dengan Mongoose v8.19.1
- **Authentication:** JWT (jsonwebtoken v9.0.2)
- **Password Hashing:** bcryptjs
- **Security:** Helmet, CORS, Rate Limiting
- **Deployment:** Vercel

---

## 📋 Persyaratan

- Node.js v16 atau lebih tinggi
- npm atau yarn
- MongoDB (lokal atau MongoDB Atlas)

---

## 💻 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/clorensia/TP5_ToDoList
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
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/todolist

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=*

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Jalankan Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server akan berjalan di `http://localhost:5000`

---

## 📁 Struktur Project

```
src/
├── config/
│   └── database.js              # Konfigurasi MongoDB
├── constants/
│   └── index.js                 # Konstanta aplikasi
├── controllers/
│   ├── authController.js        # Logika autentikasi
│   └── todoController.js        # Logika todo CRUD
├── middleware/
│   ├── auth.js                  # Verifikasi JWT
│   └── errorHandler.js          # Penanganan error
├── models/
│   ├── User.js                  # Schema user
│   └── Todo.js                  # Schema todo
├── routes/
│   ├── auth.js                  # Endpoint autentikasi
│   └── todos.js                 # Endpoint todo
├── utils/
│   ├── logger.js                # Logging utility
│   └── responseFormatter.js     # Format response
├── validators/
│   ├── authValidator.js         # Validasi input auth
│   └── todoValidator.js         # Validasi input todo
├── app.js                       # Konfigurasi Express
└── server.js                    # Entry point
```

---

## 🔐 API Endpoints

### Autentikasi

#### 1. Register User
**POST** `/api/auth/register`

Request body:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

Response (201):
```json
{
  "status": "success",
  "statusCode": 201,
  "message": "User berhasil terdaftar",
  "data": {
    "id": "...",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

#### 2. Login
**POST** `/api/auth/login`

Request body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response (200):
```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Login berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "...",
      "username": "john_doe",
      "email": "john@example.com"
    }
  }
}
```

---

### Todo Management

Semua endpoint todo memerlukan authentication header:
```
Authorization: Bearer <token>
```

#### 3. Buat Todo
**POST** `/api/todos`

Request body:
```json
{
  "title": "Belajar Express.js",
  "description": "Membuat RESTful API",
  "priority": "high",
  "dueDate": "2024-12-31"
}
```

Response (201):
```json
{
  "status": "success",
  "statusCode": 201,
  "message": "Todo berhasil dibuat",
  "data": {
    "_id": "...",
    "title": "Belajar Express.js",
    "description": "Membuat RESTful API",
    "status": "pending",
    "priority": "high",
    "dueDate": "2024-12-31T00:00:00.000Z",
    "isOverdue": false,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

#### 4. Ambil Semua Todo
**GET** `/api/todos`

Query parameters (opsional):
- `status` - Filter berdasarkan status (pending, in progress, completed)
- `priority` - Filter berdasarkan prioritas (low, medium, high)
- `sortBy` - Urutkan berdasarkan (createdAt, priority, dueDate, status)
- `page` - Nomor halaman (default: 1)
- `limit` - Item per halaman (default: 10, max: 50)

Contoh: `GET /api/todos?status=pending&priority=high&sortBy=dueDate&page=1&limit=10`

Response (200):
```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Data todo berhasil diambil",
  "data": [...],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

#### 5. Ambil Detail Todo
**GET** `/api/todos/:id`

Response (200):
```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Detail todo berhasil diambil",
  "data": {...}
}
```

#### 6. Update Todo
**PUT** `/api/todos/:id`

Request body (semua field opsional):
```json
{
  "title": "Judul baru",
  "status": "in progress",
  "priority": "medium",
  "description": "Deskripsi baru"
}
```

Response (200):
```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Todo berhasil diubah",
  "data": {...}
}
```

#### 7. Hapus Todo
**DELETE** `/api/todos/:id`

Response (200):
```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Todo berhasil dihapus",
  "data": null
}
```

#### 8. Hapus Semua Todo
**DELETE** `/api/todos`

Response (200):
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

#### 9. Health Check
**GET** `/api/health`

Response (200):
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

---

## 📊 HTTP Status Codes

| Kode | Arti |
|------|------|
| 200 | OK - Request berhasil |
| 201 | Created - Resource berhasil dibuat |
| 400 | Bad Request - Input tidak valid |
| 401 | Unauthorized - Token missing/invalid/expired |
| 404 | Not Found - Resource tidak ditemukan |
| 409 | Conflict - Resource duplicate (email/username) |
| 500 | Internal Server Error - Server error |

---

## 🔒 Security Features

- **JWT Authentication:** Token-based authentication dengan ekspirasi 7 hari
- **Password Hashing:** Bcryptjs dengan 10 rounds salt
- **Input Validation:** Validasi comprehensive untuk semua input
- **Authorization:** User hanya bisa akses todo milik mereka
- **Rate Limiting:** 100 request per 15 menit
- **Helmet:** HTTP security headers
- **CORS:** Cross-origin resource sharing protection
- **Error Handling:** Proper error responses dengan status codes

---

## 🗄️ Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  username: String (unique, 3-30 chars),
  email: String (unique, valid email),
  password: String (hashed, min 6 chars),
  createdAt: Date,
  updatedAt: Date
}
```

### Todo Collection
```javascript
{
  _id: ObjectId,
  title: String (required, max 200 chars),
  description: String (max 1000 chars),
  status: String (pending, in progress, completed),
  priority: String (low, medium, high),
  dueDate: Date (tidak boleh di masa lalu),
  createdBy: ObjectId (ref: User),
  isOverdue: Boolean (virtual field),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🧪 Testing dengan Postman

### Langkah-langkah

1. **Import Collection**
   - Buka https://documenter.getpostman.com/view/49308345/2sB3QNr9Kn
   - Klik "Run in Postman"
   - Pilih workspace

2. **Setup Environment Variable**
   - Buat environment baru bernama "ToDoList"
   - Tambahkan variable: `token` (initial value: kosong)

3. **Testing Flow**
   - Register user
   - Login (simpan token ke environment variable)
   - Create, Read, Update, Delete todos
   - Test dengan berbagai filter dan sorting

---

## 🚀 Deployment ke Vercel

### Persiapan

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login ke Vercel:
```bash
vercel login
```

### Deploy

1. Deploy ke staging:
```bash
vercel
```

2. Setup Environment Variables di Vercel Dashboard:
   - `MONGODB_URI` - MongoDB Atlas connection string
   - `JWT_SECRET` - Generate dengan: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
   - `NODE_ENV` - production

3. Deploy ke production:
```bash
vercel --prod
```

---

## 📝 Environment Variables

| Variable | Deskripsi | Contoh |
|----------|-----------|--------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development / production |
| MONGODB_URI | MongoDB connection | mongodb+srv://user:pass@cluster.mongodb.net/db |
| JWT_SECRET | JWT secret key | random_64_chars_string |
| JWT_EXPIRES_IN | Token expiration | 7d |
| CORS_ORIGIN | Allowed origins | * atau http://localhost:3000 |
| RATE_LIMIT_WINDOW_MS | Rate limit window (ms) | 900000 (15 menit) |
| RATE_LIMIT_MAX_REQUESTS | Max requests per window | 100 |

---

## 📦 NPM Scripts

```bash
npm start       # Jalankan server (production)
npm run dev     # Jalankan server dengan nodemon (development)
```

---

## 🐛 Troubleshooting

| Masalah | Penyebab | Solusi |
|---------|---------|--------|
| Cannot connect MongoDB | URI salah atau MongoDB offline | Check MONGODB_URI, start MongoDB |
| Module not found | Dependency missing | Run `npm install` |
| Port already in use | App lain menggunakan port | `lsof -ti:5000 \| xargs kill -9` |
| 401 Unauthorized | Token invalid/missing | Check token format, re-login |
| CORS error | CORS_ORIGIN wrong | Update .env CORS_ORIGIN |
| Validation error | Input invalid | Check input format, read error message |

---

## 📚 Dokumentasi Tambahan

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Documentation](https://jwt.io/)

---

## 👨‍💻 Developer

**Project:** ToDoList RESTful API
**Author:** Clorensias
**License:** MIT

---

## 📞 Support

Untuk pertanyaan atau issue, silakan buat issue di GitHub repository ini.

---

**Last Updated:** Oktober 2025
**API Status:** Live dan Production Ready