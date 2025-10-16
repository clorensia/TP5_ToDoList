const mongoose = require('mongoose');

const STATUS_ENUM = ['pending', 'in progress', 'completed'];
const PRIORITY_ENUM = ['low', 'medium', 'high'];

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: ''
    },
    status: {
      type: String,
      enum: {
        values: STATUS_ENUM,
        message: '{VALUE} is not a valid status'
      },
      default: 'pending'
    },
    priority: {
      type: String,
      enum: {
        values: PRIORITY_ENUM,
        message: '{VALUE} is not a valid priority'
      },
      default: 'medium'
    },
    dueDate: {
      type: Date,
      validate: {
        validator: function(value) {
          if (this.isNew && value) {
            return value >= new Date().setHours(0, 0, 0, 0);
          }
          return true;
        },
        message: 'Due date cannot be in the past'
      }
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Compound indexes for optimized queries
todoSchema.index({ createdBy: 1, status: 1 });
todoSchema.index({ createdBy: 1, priority: 1 });
todoSchema.index({ createdBy: 1, createdAt: -1 });

// Virtual: Check if todo is overdue
todoSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate || this.status === 'completed') return false;
  return new Date() > this.dueDate;
});

// Enable virtuals in JSON
todoSchema.set('toJSON', { virtuals: true });
todoSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Todo', todoSchema);