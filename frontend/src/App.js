import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import InstituteSignup from './Institute/InstituteSignup';
import InstituteInterface from './Institute/InstituteInterface';
import AddVehicleInfo from './Institute/VehicleInfo';
import DriverInterface from './Driver/DriverInterface';
import StartRouteButton from './Driver/StartRouteButton';
import SignupForm from './Students/Signup';
import StudentInterface from './Students/StudentInterface';
import ProtectedRoute from './Components/ProtectedRoute';
import NotAuthorized from './Components/NotAuthorized';
import VehicleInterface from './Students/VehicleInterface';
import SeeVehicle from './Institute/SeeVehicle';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register/institute" element={<InstituteSignup />} />
        <Route path="/register/student" element={<SignupForm />} />
        <Route path="/not-authorized" element={<NotAuthorized />} />

        {/* Protected routes */}
        <Route
          path="/student/interface"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentInterface />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/VehicleRoute/:vehicleName"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <VehicleInterface />
            </ProtectedRoute>
          }
        />
        <Route
          path="/institute/interface"
          element={
            <ProtectedRoute allowedRoles={['institute']}>
              <InstituteInterface />
            </ProtectedRoute>
          }
        />
        <Route
          path="/institute/add-vehicle"
          element={
            <ProtectedRoute allowedRoles={['institute']}>
              <AddVehicleInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/interface"
          element={
            <ProtectedRoute allowedRoles={['driver']}>
              <DriverInterface />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Driver/StartRouteButton"
          element={
            <ProtectedRoute allowedRoles={['driver']}>
              <StartRouteButton />
            </ProtectedRoute>
          }
        />
        <Route
          path="/institute/see-vehicles"
          element={
            <ProtectedRoute allowedRoles={['institute']}>
              <SeeVehicle />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
