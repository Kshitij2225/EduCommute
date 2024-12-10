import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast} from 'react-toastify';

function InstituteSignup() {
  const [formData, setFormData] = useState({
    name: '',
    instituteType: '',
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
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/register/Institute", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          InstituteType: formData.instituteType,  // Correct field name for backend
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
      toast.success("Signup successful, please login!");
        navigate("/");  // Redirect after success
      } else {
      toast.error(result.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
    toast.error("An error occurred. Please try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="institute-info-container">
      <form className="institute-info-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Enter your institute name"
          value={formData.name}
          onChange={handleChange}
          className="institute-info-input"
          required
        />

        <select
          name="instituteType"
          value={formData.instituteType}
          onChange={handleChange}
          className="institute-info-dropdown"
          required
        >
          <option value="" disabled>Select Institute Type</option>
          <option value="College">College</option>
          <option value="School">School</option>
        </select>

        <input
          type="tel"
          name="contact"
          placeholder="Institute contact number"
          value={formData.contact}
          onChange={handleChange}
          className="institute-info-input"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="institute-info-input"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
          className="institute-info-input"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="institute-info-input"
          required
        />

        <button type="submit" className="institute-info-register-btn" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form><br />

      <Link to='/' className='institute-info-login-btn1'>
        <h4 className="institute-info-login-btn">Already have an account? Login</h4>
      </Link>
    </div>
  );
}

export default InstituteSignup;
