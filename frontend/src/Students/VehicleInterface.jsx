import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import busLogo from '../Driver/bus_logo.png';
import dot from "../Images/dot.png";
import RoutingComponent from '../Driver/RoutingComponent';// Ensure the correct path

const VehicleInterface = () => {
  const { vehicleName } = useParams(); // Capture vehicleName from URL
  const [vehicleData, setVehicleData] = useState(null);
  const [routePoints, setRoutePoints] = useState([]);
  const [driverPosition, setDriverPosition] = useState(null);
  const [loading, setLoading] = useState(true);

  // Custom icons
  const driverIcon = L.icon({
    iconUrl: dot,
    iconSize: [7, 7],
  });

  const dotIcon = L.icon({
    iconUrl: busLogo,
    iconSize: [20, 20],
  });

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/Data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ requestType: 'getVehicles' }), // Adjust the request to get all vehicles
        });
        const data = await response.json();

        // Flatten the array of arrays
        const flattenedData = data.flat();
        // Find the specific vehicle using the vehicleName from URL
        const vehicleDetail = flattenedData.find(vehicle => vehicle.vehicleName === vehicleName);

        if (vehicleDetail) {
          setVehicleData(vehicleDetail);
          setRoutePoints(vehicleDetail.routes); // Assuming routes are part of vehicleDetail
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
        setLoading(false);
      }
    };

    fetchVehicleData();
  }, [vehicleName]); // Refetch when vehicleName changes

  useEffect(() => {
    // Retrieve driver's position from localStorage
    const storedDriverPosition = JSON.parse(localStorage.getItem('driverPosition'));
    if (storedDriverPosition) {
      setDriverPosition(storedDriverPosition);
    }
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!vehicleData) {
    return <p>No data available for {vehicleName}</p>;
  }

  return (
    <div className='vehicle_Data'>
        <div className='vehicle_information'>
      <h2>Vehicle Information: {vehicleData.vehicleName}</h2>
      <p>Driver Name: {vehicleData.driverName}</p>
      <p>Contact Number: {vehicleData.contactNumber}</p>
      <p>Vehicle Type: {vehicleData.vehicleType}</p>
      <p>Vehicle Number: {vehicleData.vehicleNumber}</p>
      </div>
      <div className='Map_Container'>
      <div style={{ height: '70vh', width: '80%', }}>
        <MapContainer
          center={driverPosition || [vehicleData.routes[0]?.lat || 0, vehicleData.routes[0]?.lon || 0]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />

          {driverPosition && (
            <Marker position={driverPosition} icon={dotIcon} />
          )}

          {/* Display route points */}
          {routePoints.map((point, index) => (
            <Marker
              key={index}
              position={[point.lat, point.lon]}
              icon={driverIcon}
              title={point.display_name}
            />
          ))}

          {/* Draw route path using RoutingComponent */}
          <RoutingComponent routePoints={routePoints} />
        </MapContainer>
      </div>
      </div>
    </div>
  );
};

export default VehicleInterface;
