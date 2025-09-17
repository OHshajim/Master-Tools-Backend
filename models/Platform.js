
const mongoose = require('mongoose');

const PlatformSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a platform name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  url: {
    type: String,
    required: [true, 'Please add a URL'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    trim: true
  },
  logo: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Platform', PlatformSchema);
