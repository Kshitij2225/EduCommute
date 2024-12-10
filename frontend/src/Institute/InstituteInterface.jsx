import React from 'react';
import { Link } from 'react-router-dom';
import LogoutBtn from '../Components/LogoutBtn';

function InstituteInterface() {
  return (
    <>
      <LogoutBtn />
      <div className="institute-interface-container">
        <h1>Institute Interface</h1>
        <Link to="/institute/add-vehicle" style={{ textDecoration: 'none' }}>
          <button className="institute-interface-button">Add Vehicles</button>
        </Link>
        <Link to="/institute/see-vehicles" style={{ textDecoration: 'none' }}>
          <button className="institute-interface-button">See Vehicles</button>
        </Link>
      </div>
    </>
  );
}

export default InstituteInterface;
