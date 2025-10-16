const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username adalah field yang wajib diisi'],
      unique: true,
      trim: true,
      minlength: [3, 'Username minimal 3 karakter'],
      maxlength: [30, 'Username maksimal 30 karakter'],
      lowercase: false
    },
    email: {
      type: String,
      required: [true, 'Email adalah field yang wajib diisi'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Masukkan email yang valid'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password adalah field yang wajib diisi'],
      minlength: [6, 'Password minimal 6 karakter'],
      select: false // Don't return password by default
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Index untuk optimasi query
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

// Pre-save hook: Hash password sebelum disimpan
userSchema.pre('save', async function(next) {
  // Hanya hash jika password berubah
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method: Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Instance method: Return public user data
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);