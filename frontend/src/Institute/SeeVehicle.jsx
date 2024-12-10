import React, { useEffect, useState } from 'react';
import "./SeeVehicle.css"

const SeeVehicle = () => {
  const [vehicleData, setVehicleData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/Data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ requestType: 'getVehicles' }),
        });
        const data = await response.json();
        setVehicleData(data.flat());
      } catch (error) {
        console.error('Error fetching vehicle data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="vehicle-list-container">
      <h2>Vehicles List</h2>
      {vehicleData.length > 0 ? (
        <table className="vehicle-table">
          <thead>
            <tr>
              <th>Vehicle Name</th>
              <th>Vehicle Number</th>
              <th>Vehicle Type</th>
              <th>Driver Name</th>
              <th>Contact Number</th>
              <th>Email</th>
              <th>Routes</th>
            </tr>
          </thead>
          <tbody>
            {vehicleData.map((vehicle, index) => (
              <tr key={index}>
                <td>{vehicle.vehicleName}</td>
                <td>{vehicle.vehicleNumber}</td>
                <td>{vehicle.vehicleType}</td>
                <td>{vehicle.driverName}</td>
                <td>{vehicle.contactNumber}</td>
                <td>{vehicle.email}</td>
                <td>
                  <ul>
                    {vehicle.routes && vehicle.routes.length > 0 ? (
                      vehicle.routes.map((route, i) => (
                        <li key={i}>{route.display_name}</li>
                      ))
                    ) : (
                      <li>No routes available</li>
                    )}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No vehicles available.</p>
      )}
    </div>
  );
};

export default SeeVehicle;
