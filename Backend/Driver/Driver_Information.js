const mongoose = require('mongoose');

// Define the Stop schema
const StopSchema = new mongoose.Schema({
  lat: {
    type: Number, // Changed to Number
    required: true
  },
  lon: {
    type: Number, // Changed to Number
    required: true
  },
  display_name: {
    type: String,
    required: true,
    trim: true
  }
});

// Define the Driver schema
const DriverSchema = new mongoose.Schema({
  vehicleName: {
    type: String,
    required: true,
    trim: true
  },
  vehicleNumber: {
    type: String,
    required: true,
    trim: true
  },
  vehicleType: {
    type: String,
    required: false
  },
  driverName: {
    type: String,
    required: true,
    trim: true
  },
  contactNumber: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /\d{10}/.test(v), // 10-digit number
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
      validator: (v) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v),
      message: props => `${props.value} is not a valid email!`
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  routes: {
    type: [StopSchema]
  }
});

// Export the Driver model
module.exports = mongoose.model('Driver', DriverSchema);
