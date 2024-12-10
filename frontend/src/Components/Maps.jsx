import React, { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine"; // Import Leaflet Routing Machine
import "leaflet-control-geocoder"; // Import Leaflet Control Geocoder
import PlaceHolder from './placeholder.png';

const icon = L.icon({
  iconUrl: PlaceHolder,
  iconSize: [38, 38],
});

const RoutingComponent = ({ routePoints }) => {
  const map = useMap();

  useEffect(() => {
    if (routePoints.length > 0) {
      // Clear existing routing controls
      map.eachLayer((layer) => {
        if (layer instanceof L.Routing.Control) {
          map.removeControl(layer);
        }
      });

      // Prepare routing points
      const waypoints = routePoints.map(point => L.latLng(point.lat, point.lon));

      // Create the routing control
      L.Routing.control({
        waypoints: waypoints,
        routeWhileDragging: true,
        geocoder: L.Control.Geocoder.nominatim(), // Use the imported geocoder here
      }).addTo(map);
    }
  }, [routePoints, map]); // Add map as a dependency

  return null;
};

export default function Maps({ routePoints }) {
  const defaultPosition = [26.9124, 75.7873];

  return (
    <MapContainer center={defaultPosition} zoom={8} style={{ width: "80%", height: "80%", marginLeft: '100px' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=fb34vZZ8pHivJG8b6xja"
      />
      {routePoints.map((point, index) => (
        <Marker key={index} position={[point.lat, point.lon]} icon={icon}>
          <Popup>{point.display_name}</Popup>
        </Marker>
      ))}
      <RoutingComponent routePoints={routePoints} />
    </MapContainer>
  );
}
