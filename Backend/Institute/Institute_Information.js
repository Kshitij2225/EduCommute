const mongoose = require('mongoose');

// Define the schema for institute details
const instituteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  InstituteType: { 
    type: String,
    enum: ['College', 'School'], 
    required: true
  },
  contactNumber: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /\d{10}/.test(v); // Validate for a 10-digit phone number
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
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v); // Validate email format
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

module.exports = mongoose.model('Institute', instituteSchema);
