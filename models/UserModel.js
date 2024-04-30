const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [20, 'Name cannot be more than 20 characters'],
  },
  age: {
    type: Number,
    required: [true, 'Please provide an age'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
});


const User = mongoose.model('User', UserSchema);

module.exports = User