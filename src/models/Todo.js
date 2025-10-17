const mongoose = require('mongoose');
const { TODO_STATUS, TODO_PRIORITY } = require('../constants');

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title adalah field yang wajib diisi'],
      trim: true,
      maxlength: [200, 'Title maksimal 200 karakter']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description maksimal 1000 karakter'],
      default: ''
    },
    status: {
      type: String,
      enum: {
        values: Object.values(TODO_STATUS),
        message: '{VALUE} bukan status yang valid'
      },
      default: TODO_STATUS.PENDING
    },
    priority: {
      type: String,
      enum: {
        values: Object.values(TODO_PRIORITY),
        message: '{VALUE} bukan priority yang valid'
      },
      default: TODO_PRIORITY.MEDIUM
    },
    dueDate: {
      type: Date,
      default: null
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator adalah field yang wajib diisi'],
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Compound indexes untuk optimasi query
todoSchema.index({ createdBy: 1, status: 1 });
todoSchema.index({ createdBy: 1, priority: 1 });
todoSchema.index({ createdBy: 1, createdAt: -1 });
todoSchema.index({ createdBy: 1, dueDate: 1 });

// Virtual: Check if todo is overdue
// Menggunakan getter function yang proper
todoSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate || this.status === TODO_STATUS.COMPLETED) {
    return false;
  }
  return new Date() > this.dueDate;
});

// Enable virtuals in JSON output
todoSchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    // Remove _id dari output, pakai id saja
    ret.id = ret._id;
    delete ret._id;
    return ret;
  }
});

todoSchema.set('toObject', { virtuals: true });

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;