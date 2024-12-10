import React from 'react';
import { Link } from 'react-router-dom';
import LogoutBtn from '../Components/LogoutBtn';

const StartRouteButton = () => {
  return (
    <>
    <LogoutBtn/>
    <Link to='/driver/interface'>
    <button className="start-route-button">
      Start Route
    </button>
    </Link>
    </>
  );
};

export default StartRouteButton;
