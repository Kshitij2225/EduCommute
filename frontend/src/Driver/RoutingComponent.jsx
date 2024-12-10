import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';

const RoutingComponent = ({ routePoints }) => {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    // Remove existing control if already added
    if (routingControlRef.current) {
      try {
        routingControlRef.current.getPlan().setWaypoints([]); // Clear waypoints
        map.removeControl(routingControlRef.current); // Remove the control
      } catch (error) {
        console.warn('Failed to clear existing routing control:', error);
      }
      routingControlRef.current = null; // Reset the ref after removal
    }

    // Create and add new routing control if there are enough route points
    if (routePoints.length >= 2) {
      routingControlRef.current = L.Routing.control({
        waypoints: routePoints.map(point => L.latLng(point.lat, point.lon)),
        routeWhileDragging: false, // Disable route updating while dragging
        createMarker: () => null, // Disable default marker creation
        show: false, // Hide the routing instructions box
        geocoder: L.Control.Geocoder.nominatim(), // Optional: Geocoder
      }).addTo(map);
    }

    // Cleanup function to run when the component unmounts or routePoints change
    return () => {
      if (routingControlRef.current) {
        try {
          routingControlRef.current.getPlan().setWaypoints([]); // Clear waypoints
          map.removeControl(routingControlRef.current); // Remove control from the map
          routingControlRef.current = null; // Reset ref to prevent future issues
        } catch (error) {
          console.warn('Cleanup failed:', error);
        }
      }
    };
  }, [routePoints, map]);

  return null; // This component doesn’t render any visible elements
};

export default RoutingComponent;
