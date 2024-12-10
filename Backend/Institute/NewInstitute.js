const express = require('express');
const router = express.Router();
const Institute = require('./Institute_Information.js');
require('dotenv').config();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

router.post('/register/Institute', [
    // Validation middleware
    body('email', 'Enter a valid Email Id').isEmail(),
    body('name', 'Name must be at least 2 characters long').isLength({ min: 2 }),
    body('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
    body('confirmPassword', 'Confirm password is required').exists(),
    body('contactNumber', 'Enter a valid 10-digit contact number').isLength({ min: 10, max: 10 }).isNumeric(),
    body('InstituteType', 'Select a Institute Type').isIn(['College', 'School']),
  ], async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { name, email, password, confirmPassword, contactNumber, InstituteType } = req.body;
  
    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match!" });
    }
  
    try {
      // Check if the email is already registered
      let existingInstitute = await Institute.findOne({ email });
      if (existingInstitute) {
        return res.status(400).json({ success: false, message: 'Email id already exists' });
      }
  
      // Generate salt and hash the password
      const salt = await bcrypt.genSalt(10);
      let securePassword = await bcrypt.hash(password, salt);
  
      // Create a new institute entry
      const institute = new Institute({
        name,
        email,
        password: securePassword,
        contactNumber,
        InstituteType
      });
  
      // Save the institute to the database
      await institute.save();
  
      res.status(201).json({ success: true, message: 'Institute registered successfully!' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  });
  

  router.post('/login/Institute', [
    // Validation middleware
    body('email', 'Enter a valid Email Id').isEmail(),
    body('password', 'Enter a valid password').isLength({ min: 6 }),
  ], async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { email, password } = req.body;
  
    try {
      // Check if the email exists in the Institute database
      let instituteData = await Institute.findOne({ email });
      if (!instituteData) {
        return res.status(400).json({ errors: 'Email not found' });
      }
  
      // Compare the input password with the hashed password stored in the database
      const passwordCompare = await bcrypt.compare(password, instituteData.password);
      if (!passwordCompare) {
        return res.status(400).json({ errors: 'Incorrect password' });
      }
  
      // Prepare JWT payload with the institute's id
      const data = {
        institute: {
          id: instituteData.id,
        },
      };
  
      // Sign the JWT with the payload and secret
      const authToken = jwt.sign(data, jwtSecret);
      
      // Return success response with the auth token
      return res.json({ success: true, authToken });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Server Error' });
    }
  });

module.exports = router;
