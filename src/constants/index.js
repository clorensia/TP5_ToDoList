// Todo Status
const TODO_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in progress',
  COMPLETED: 'completed'
};

// Todo Priority
const TODO_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

// Response Status
const RESPONSE_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error'
};

// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

// Error Messages
const ERROR_MESSAGES = {
  // Auth Errors
  INVALID_CREDENTIALS: 'Email atau password salah',
  USER_ALREADY_EXISTS: 'Email atau username sudah terdaftar',
  USER_NOT_FOUND: 'User tidak ditemukan',
  TOKEN_MISSING: 'Token tidak ditemukan',
  TOKEN_INVALID: 'Token tidak valid',
  TOKEN_EXPIRED: 'Token sudah expired',
  UNAUTHORIZED: 'Anda tidak berhak mengakses resource ini',

  // Todo Errors
  TODO_NOT_FOUND: 'Todo tidak ditemukan',
  INVALID_TODO_ID: 'ID todo tidak valid',
  INVALID_STATUS: 'Status tidak valid',
  INVALID_PRIORITY: 'Priority tidak valid',

  // Validation Errors
  VALIDATION_ERROR: 'Validasi gagal',
  REQUIRED_FIELD: '{field} harus diisi',
  INVALID_EMAIL: 'Email tidak valid',
  PASSWORD_MISMATCH: 'Password dan konfirmasi password tidak cocok',
  PASSWORD_TOO_SHORT: 'Password minimal 6 karakter',
  USERNAME_TOO_SHORT: 'Username minimal 3 karakter',
  DUE_DATE_PAST: 'Due date tidak boleh di masa lalu',

  // Server Errors
  INTERNAL_ERROR: 'Terjadi kesalahan pada server',
  DATABASE_ERROR: 'Terjadi kesalahan pada database'
};

// Success Messages
const SUCCESS_MESSAGES = {
  REGISTER_SUCCESS: 'User berhasil terdaftar',
  LOGIN_SUCCESS: 'Login berhasil',
  TODO_CREATED: 'Todo berhasil dibuat',
  TODO_UPDATED: 'Todo berhasil diubah',
  TODO_DELETED: 'Todo berhasil dihapus',
  ALL_TODOS_DELETED: 'Semua todo berhasil dihapus',
  TODOS_RETRIEVED: 'Data todo berhasil diambil',
  TODO_DETAIL_RETRIEVED: 'Detail todo berhasil diambil'
};

module.exports = {
  TODO_STATUS,
  TODO_PRIORITY,
  RESPONSE_STATUS,
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
};