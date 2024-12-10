import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import busLogo from './bus_logo.png';
import dot from "../Images/dot.png";
import RoutingComponent from './RoutingComponent'; // Ensure the correct path

const DriverInterface = () => {
  const [routePoints, setRoutePoints] = useState([]);
  const [driverPosition, setDriverPosition] = useState(null);

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
    const email = localStorage.getItem('email');

    const fetchRouteData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/Data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        const driverData = data.flat().find((item) => item.email === email);
        if (driverData) {
          setRoutePoints(driverData.routes);
        } else {
          console.error('Driver not found');
        }
      } catch (error) {
        console.error('Error fetching route data:', error);
      }
    };

    fetchRouteData();
  }, []);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setDriverPosition([latitude, longitude]);
        // Store the driver's position in localStorage
        localStorage.setItem('driverPosition', JSON.stringify([latitude, longitude]));
      },
      (error) => {
        console.error('Error getting driver position:', error);
      },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div style={{ height: '100vh', width: '100vh' }}>
      <h3>Driver Interface</h3>
      {routePoints.length > 0 ? (
        <MapContainer
          center={driverPosition || [routePoints[0].lat, routePoints[0].lon]}
          zoom={13}
          style={{ height: '90vh', width: '100%' }}
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
      ) : (
        <div>No route points available for this driver.</div>
      )}
    </div>
  );
};

export default DriverInterface;
