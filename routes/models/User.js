const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    require: true,
    default: 'member',
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  position: {
    type: String,
    default: 'developer',
  },
});

const User = mongoose.model('user', userSchema);
module.exports = User;
