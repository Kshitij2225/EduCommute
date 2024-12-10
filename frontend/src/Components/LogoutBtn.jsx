import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutBtn() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the token and role from local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('role'); // Assuming you stored the role in local storage
    localStorage.removeItem('email'); // Assuming you stored the email in local storage

    // Optionally, navigate the user to the login page or home page after logout
    navigate('/');
  };

  return (
    <div>
      <button className='Logout-btn' onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default LogoutBtn;
