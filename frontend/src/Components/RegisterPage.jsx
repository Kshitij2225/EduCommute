import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './RegisterPage.css';
import { toast } from 'react-toastify';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const savedRole = localStorage.getItem('role');
    
    if (token && savedRole) {
      // Redirect based on stored role
      if (savedRole === 'student') {
        navigate('/student/interface');
      } else if (savedRole === 'institute') {
        navigate('/institute/interface');
      } else if (savedRole === 'driver') {
        navigate('/Driver/StartRouteButton');
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    let apiUrl = '';
    if (role === 'student') {
      apiUrl = 'http://localhost:5000/api/login/Student';
    } else if (role === 'institute') {
      apiUrl = 'http://localhost:5000/api/login/Institute';
    } else if (role === 'driver') {
      apiUrl = 'http://localhost:5000/api/login/Driver';
    }
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        toast.error(result.message || 'Login failed. Please try again.');
        setLoading(false);
        return;
      }
  
      if (result.success && result.authToken) {
        // Save the token and email in localStorage
        localStorage.setItem('authToken', result.authToken); 
        localStorage.setItem('email', email);  // Save email here
        localStorage.setItem('role', role);
  
        toast.success("Login Successful");
  
        // Redirect based on role
        if (role === 'student') {
          navigate('/student/interface');
        } else if (role === 'institute') {
          navigate('/institute/interface');
        } else if (role === 'driver') {
          navigate('/Driver/StartRouteButton');
        }
      } else {
        toast.error(result.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('An error occurred. Please try again later.');
    }
  
    setLoading(false);
  };
  
  
  return (
    <div className="home-container">
      <div className="right-section">
        <div className="login-container">
          <h2>LOGIN</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <input 
              type="email"
              className="login-input"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="login-input"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <select
              className="login-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="student">Student</option>
              <option value="institute">Institute</option>
              <option value="driver">Driver</option>
            </select><br />

            <button className="login-button" type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p>Don't have an account?</p>
          <div className="register-buttons">
            <Link to="/register/student" className="register-btn">Register as Student</Link>
            <Link to="/register/institute" className="register-btn">Register as Institute</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
