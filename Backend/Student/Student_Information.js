const mongoose = require('mongoose');
const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  CollegeName: {
    type: String,
    required: true,
    trim: true
  },

  contactNumber: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /\d{10}/.test(v); 
      },
      message: props => `${props.value} is not a valid phone number!` 
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v); 
      },
      message: props => `${props.value} is not a valid email!` 
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
});

module.exports = mongoose.model('Student', StudentSchema);
