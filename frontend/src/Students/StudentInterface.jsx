import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutBtn from '../Components/LogoutBtn';

const StudentInterface = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/Data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ requestType: 'getVehicles' }),
        });
        const data = await response.json();

        // Flatten the array of arrays into a single array
        const flattenedData = data.flat(); // This will flatten the outer array
        setVehicles(flattenedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        setLoading(false);
      }
    };

    fetchVehicles(); // Initial fetch on component mount
    const intervalId = setInterval(fetchVehicles, 5000); // Poll every 5 seconds
    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  return (
    <>
      <div className="vehicle-container">
        <h2 className="vehicle-title">Vehicle's Name:</h2>
        <div className="vehicle-btn-container">
          {loading ? (
            <p>Loading...</p>
          ) : (
            vehicles.reduce((rows, vehicle, index) => {
              const rowIndex = Math.floor(index / 4); // Divide buttons into groups of 4
              if (!rows[rowIndex]) {
                rows[rowIndex] = []; // Start a new row
              }
              rows[rowIndex].push(
                <Link key={vehicle._id} to={`/student/VehicleRoute/${vehicle.vehicleName}`}>
                  <button className="vehicle-button">{vehicle.vehicleName}</button>
                </Link>
              );
              return rows;
            }, []).map((row, rowIndex) => (
              <div className="vehicle-buttons" key={rowIndex}>
                {row}
              </div>
            ))
          )}
        </div>
      </div>
      <LogoutBtn />
    </>
  );
};

export default StudentInterface;
