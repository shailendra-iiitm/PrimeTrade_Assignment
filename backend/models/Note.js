const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Note content is required'],
    maxlength: [1000, 'Note cannot exceed 1000 characters']
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isAdminNote: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

noteSchema.index({ task: 1, createdAt: -1 });

module.exports = mongoose.model('Note', noteSchema);
