import React, { useState } from 'react';
import { Routes, useNavigate } from 'react-router-dom'; // Import useNavigate
import SearchBox from "../Components/SearchBox";
import Maps from "../Components/Maps";
import Button from '@mui/material/Button';

const AddVehicleInfo = () => {
    const navigate = useNavigate(); 
    const [routePoints, setRoutePoints] = useState([]);
    const [formData, setFormData] = useState({
        vehicleName: "",
        vehicleType: "bus", 
        vehicleNumber: "",
        driverName: "",
        email: "",
        password: "",
        confirmPassword: "",
        contactNumber: "",
        routes:""
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
    
        // Combine form data with route points
        const combinedData = {
            ...formData,
            routes: routePoints // Include route points in the form submission
        };
    
        // console.log("Submitting Data:", combinedData);




        //All right here
    
        try {
            const response = await fetch('http://localhost:5000/api/register/Driver', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(combinedData), // Send the combined data to the backend
            });
            // console.log(combinedData)
    
            const result = await response.json();
    
            if (response.ok) {
                // Save route points to local storage after successful registration
                localStorage.setItem('driverRoutes', JSON.stringify(routePoints)); 
                // console.log("Saved route points to local storage:", routePoints);
                alert("Driver registered successfully, Please login!");
                navigate('/institute/interface'); // Navigate to the desired route
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error("Error during registration:", error);
        }
    };

    return (
        <>
            <div className="add-vehicle-body">
                <div className="add-vehicle-container">
                    <h1 className="add-vehicle-title">Add Vehicle Information</h1>
                    <form className="add-vehicle-form" onSubmit={handleFormSubmit}>
                        {/* Your form inputs remain the same */}
                        <div className="add-vehicle-section">
                            {/* Vehicle Name, Type, and Number */}
                            <div className="add-vehicle-group">
                                <label htmlFor="vehicleName" className="add-vehicle-label">Vehicle Name</label>
                                <input
                                    type="text"
                                    id="vehicleName"
                                    name="vehicleName"
                                    className="add-vehicle-input"
                                    value={formData.vehicleName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="add-vehicle-group">
                                <label htmlFor="vehicleType" className="add-vehicle-label">Vehicle Type</label>
                                <select
                                    id="vehicleType"
                                    name="vehicleType"
                                    className="add-vehicle-input"
                                    value={formData.vehicleType}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="bus">Bus</option>
                                    <option value="van">Van</option>
                                </select>
                            </div>
                            <div className="add-vehicle-group">
                                <label htmlFor="vehicleNumber" className="add-vehicle-label">Vehicle Plate No.</label>
                                <input
                                    type="text"
                                    id="vehicleNumber"
                                    name="vehicleNumber"
                                    className="add-vehicle-input"
                                    value={formData.vehicleNumber}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="add-vehicle-section">
                            {/* Driver Name, Email, Password, Contact Number */}
                            <div className="add-vehicle-group">
                                <label htmlFor="driverName" className="add-vehicle-label">Driver Name</label>
                                <input
                                    type="text"
                                    id="driverName"
                                    name="driverName"
                                    className="add-vehicle-input"
                                    value={formData.driverName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="add-vehicle-group">
                                <label htmlFor="email" className="add-vehicle-label">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="add-vehicle-input"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="add-vehicle-group">
                                <label htmlFor="password" className="add-vehicle-label">Enter Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className="add-vehicle-input"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="add-vehicle-group">
                                <label htmlFor="confirmPassword" className="add-vehicle-label">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    className="add-vehicle-input"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="add-vehicle-group">
                                <label htmlFor="contactNumber" className="add-vehicle-label">Driver Contact No.</label>
                                <input
                                    type="tel"
                                    id="contactNumber"
                                    name="contactNumber"
                                    className="add-vehicle-input"
                                    value={formData.contactNumber}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="submit-btn-container">
                            <Button type="submit">
                                Register
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

        <div className='Vehicle_route'>
            <div className='Vehicle_route_label'><h2>Vehicle Route</h2></div>

            <div style={{ display: "flex", flexDirection: "row", width: "100vw", height: "100vh", marginTop: '70px' }} className='Vehicle_route_container'>
                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '70px', alignItems: 'center', width: "40vw", height: '590px', boxShadow: '0 1px 6px grey' }} className='Vehicle_route_searchBox'>
                    <SearchBox setRoutePoints={setRoutePoints} />
                </div>
                <div style={{ width: "50vw", height: "100%" }}>
                    <Maps routePoints={routePoints} />
                </div>
            </div>
            </div>
        </>
    );
};

export default AddVehicleInfo;
