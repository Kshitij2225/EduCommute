const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Driver = require('./Driver_Information');
require('dotenv').config();

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET;

// POST route for registering a driver
router.post('/register/Driver', [
  body('email').isEmail().withMessage('Enter a valid Email Id'),
  body('driverName').isLength({ min: 2 }).withMessage('Driver Name must be at least 2 characters long'),
  body('vehicleName').not().isEmpty().withMessage('Vehicle name is required'),
  body('vehicleNumber').not().isEmpty().withMessage('Vehicle number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('confirmPassword').exists().withMessage('Confirm password is required'),
  body('contactNumber').isLength({ min: 10, max: 10 }).isNumeric().withMessage('Enter a valid 10-digit contact number'),
  body('routes').isArray({ min: 1 }).withMessage('Routes must be an array with at least one route'),
  // Uncomment and adjust the validation for routes and stops as needed
  // body('routes.*.stops').isArray({ min: 1 }).withMessage('Each route must contain stops'),
  // body('routes.*.stops.*.lat').not().isEmpty().withMessage('Latitude is required for each stop'),
  // body('routes.*.stops.*.lon').not().isEmpty().withMessage('Longitude is required for each stop'),
  // body('routes.*.stops.*.display_name').not().isEmpty().withMessage('Display name is required for each stop')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation errors:", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { driverName, email, password, confirmPassword, contactNumber, vehicleName, vehicleNumber, vehicleType, routes } = req.body;

  // Check if password and confirmPassword match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  try {
    // Check if the email is already registered
    let existingDriver = await Driver.findOne({ email });
    if (existingDriver) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new driver entry
    const driver = new Driver({
      driverName,
      email,
      password: hashedPassword,
      contactNumber,
      vehicleName,
      vehicleNumber,
      vehicleType,
      routes
    });

    // Save the driver to the database
    await driver.save();

    // Send success response
    return res.status(200).json({ message: "Driver registered successfully!" });
  } catch (error) {
    console.error("Error in registration:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error occurred', details: error.message });
    }
    return res.status(500).json({ message: "Server error" });
  }
});
// POST route for logging in a driver
router.post('/login/Driver', [
  body('email', 'Enter a valid Email Id').isEmail(),
  body('password', 'Enter a valid password').isLength({ min: 6 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let driverData = await Driver.findOne({ email });
    if (!driverData) {
      return res.status(400).json({ errors: 'Email not found' });
    }

    const passwordCompare = await bcrypt.compare(password, driverData.password);
    if (!passwordCompare) {
      return res.status(400).json({ errors: 'Incorrect password' });
    }

    const data = {
      driver: {
        id: driverData.id,
      },
    };

    const authToken = jwt.sign(data, jwtSecret);
    return res.json({ success: true, authToken });
  } catch (error) {
    console.error("Error in driver login:", error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
});


module.exports = router;
