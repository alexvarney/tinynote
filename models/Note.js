const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  },
  noteTitle: {
    type: String,
    default: 'New Note'
  },
  noteMarkdown: {
    type: String,
    default: '',
  },
  noteSlug: {
    type: String,
  },
  isPublic: {
    type: Boolean,
    default: false,
  }
},{timestamps: true,})

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;