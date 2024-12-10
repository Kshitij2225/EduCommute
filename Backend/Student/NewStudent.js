const express = require('express');
const router = express.Router();
const Student = require('./Student_Information.js');
require('dotenv').config();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

// Register Student Route
router.post('/register/Student', [
  // Validation middleware
  body('email', 'Enter a valid Email Id').isEmail(),
  body('name', 'Name must be at least 2 characters long').isLength({ min: 2 }),
  body('CollegeName', 'College name is required').not().isEmpty(),  // Validating CollegeName
  body('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
  body('confirmPassword', 'Confirm password is required').exists(),
  body('contactNumber', 'Enter a valid 10-digit contact number').isLength({ min: 10, max: 10 }).isNumeric(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, confirmPassword, contactNumber, CollegeName } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: "Passwords do not match!" });
  }

  try {
    let existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ success: false, message: 'Email id already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    let securePassword = await bcrypt.hash(password, salt);

    const newStudent = new Student({
      name,
      email,
      password: securePassword,
      contactNumber,
      CollegeName 
    });

    await newStudent.save();

    res.status(201).json({ success: true, message: 'Student registered successfully!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;









// Login Student Route
router.post('/login/Student', [
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
    // Check if the email exists in the Student database
    let StudentData = await Student.findOne({ email });
    if (!StudentData) {
      return res.status(400).json({ errors: 'Email not found' });
    }

    // Compare the input password with the hashed password stored in the database
    const passwordCompare = await bcrypt.compare(password, StudentData.password);
    if (!passwordCompare) {
      return res.status(400).json({ errors: 'Incorrect password' });
    }

    // Prepare JWT payload with the Student's id
    const data = {
      Student: {
        id: StudentData.id,
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
