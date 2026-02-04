const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  fatherName: {
    type: String,
  },
  occupation: {
    type: String,
  },
  college: {
    type: String,
  },
  address: {
    type: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
