import React, { useState } from "react";
import SearchBox from "../Components/SearchBox";
import Maps from "../Components/Maps";

function VehicleRoute() {
  const [routePoints, setRoutePoints] = useState([]);

  return (
    <div style={{ display: "flex", flexDirection: "row", width: "100vw", height: "100vh" }}>
      <div style={{width: "40vw", height: "100%" }}>
        <Maps routePoints={routePoints} />
      </div>
      <div style={{display:'flex', flexDirection:'column', justifyContent:'center', width: "30vw" }}>
        <SearchBox setRoutePoints={setRoutePoints} />
      </div>
    </div>
  );
}

export default VehicleRoute;
