import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast} from 'react-toastify';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    college: '',
    contact: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);  // Manage loading state
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  // Start loading

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      setLoading(false);  // Stop loading if validation fails
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/register/Student", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          CollegeName: formData.college,  // Correct field name for backend
          contactNumber: formData.contact,  // Correct field name for backend
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword  // Include confirmPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Signup failed. Please try again.");
        setLoading(false);
        return;
      }

      const result = await response.json();

      if (result.success) {
        toast("Signup successful, Please login!");
        navigate("/");  // Redirect after success
      } else {
        toast(result.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error("An error occurred. Please try again later.");
    }

    setLoading(false);  // Stop loading after request completes
  };

  return (
    <div className='Main-Container'>
    <div className="signup-container">
      <h2 className="signup-title">Sign up</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
          className="signup-input"
          required
        />
        <input
          type="text"
          name="college"
          placeholder="Enter College name"
          value={formData.college}
          onChange={handleChange}
          className="signup-input"
          required
        />
        <input
          type="text"
          name="contact"
          placeholder="Contact No."
          value={formData.contact}
          onChange={handleChange}
          className="signup-input"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="signup-input"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
          className="signup-input"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="signup-input"
          required
        />
        <button type="submit" className="signup-button" disabled={loading}>
          {loading ? "Signing up..." : "Submit"}
        </button>
      </form><br />
      <Link to='/' className='signup-login-button1'>
        <h4 className="signup-login-button">Already have an account? Login</h4>
      </Link>
    </div>
    </div>
  );
};

export default SignupForm;
