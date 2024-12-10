import React, { useState } from "react";
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
// import SaveRoute from "../Institute/SaveRoute";
const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";

export default function SearchBox(props) {
  const { setRoutePoints } = props;
  // const [searchText, setSearchText] = useState(""); 
  const [startingPoint, setStartingPoint] = useState(null); 
  const [stops, setStops] = useState([]); 
  const [endPoint, setEndPoint] = useState(null); 
  const [searchResults, setSearchResults] = useState([]); 
  const [activeField, setActiveField] = useState(""); 
  const [inputValues, setInputValues] = useState({ start: "", stops: [], end: "" }); 

  const handleSearch = (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    const params = {
      q: query,
      format: "json",
      addressdetails: 1,
      polygon_geojson: 0,
    };
    const queryString = new URLSearchParams(params).toString();
    fetch(`${NOMINATIM_BASE_URL}${queryString}`)
      .then((response) => response.json())
      .then((result) => {
        //  console.log("Search results:", result); 
        setSearchResults(result);
      })
      .catch((err) => console.log("Error: ", err));
  };

  const handleAddStop = () => {
    setStops([...stops, null]);
    setInputValues({ ...inputValues, stops: [...inputValues.stops, ""] });
  };

  const handleSelectLocation = (place) => {
    const location = {
      lat: place.lat,
      lon: place.lon,
      display_name: place.display_name,
    };
    
    if (activeField === "start") {
      setStartingPoint(location);
      setInputValues({ ...inputValues, start: place.display_name });
    } else if (activeField.includes("stop")) {
      const stopIndex = parseInt(activeField.split("-")[1], 10);
      const updatedStops = [...stops];
      updatedStops[stopIndex] = location; 
      setStops(updatedStops);

      const updatedInputStops = [...inputValues.stops];
      updatedInputStops[stopIndex] = place.display_name;
      setInputValues({ ...inputValues, stops: updatedInputStops });
    } else if (activeField === "end") {
      setEndPoint(location);
      setInputValues({ ...inputValues, end: place.display_name });
    }

    setSearchResults([]);
  };

  const handleRouteSubmit = () => {
    const routePoints = [startingPoint, ...stops, endPoint].filter(Boolean);
    // console.log("Route points:", routePoints); 
    setRoutePoints(routePoints); 
  };

  const handleInputChange = (field, value) => {
    handleSearch(value); // Call search directly with the input value
  
    if (field === "start") {
      setInputValues({ ...inputValues, start: value });
      setActiveField("start");
    } else if (field.includes("stop")) {
      const stopIndex = parseInt(field.split("-")[1], 10);
      const updatedInputStops = [...inputValues.stops];
      updatedInputStops[stopIndex] = value;
      setInputValues({ ...inputValues, stops: updatedInputStops });
      setActiveField(field);
    } else if (field === "end") {
      setInputValues({ ...inputValues, end: value });
      setActiveField("end");
    }
  };
  

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", height: '70vh'}}>
        <div>
          <h3 style={{color:"white"}}>Starting Point</h3>
          <OutlinedInput
          className="Route-start-point"
            value={inputValues.start}
            placeholder="Search starting point"
            onChange={(e) => handleInputChange("start", e.target.value)}
          />
          {activeField === "start" && searchResults.length > 0 && (
            <List component="nav" style={{position:"absolute", zIndex:"1", width:"400px", maxHeight:"400px", overflow:"scroll"}}>
              {searchResults.map((item) => (
                <ListItem
                  style={{backgroundColor:"white"}}
                  key={item.place_id}
                  button
                  onClick={() => handleSelectLocation(item)}
                >
                  <ListItemText primary={item.display_name} style={{ color:"black"}} />
                </ListItem>
              ))}
            </List>
          )}
        </div>

        <div>
          <h3 style={{color:"white"}}>Stops</h3>
          {stops.map((stop, index) => (
            <div key={index}>
              <OutlinedInput
              className="Route-start-point"
                style={{ width: "100%" }}
                value={inputValues.stops[index] || ""}
                placeholder={`Stop ${index + 1}`}
                onChange={(e) => handleInputChange(`stop-${index}`, e.target.value)}
              />
              {activeField === `stop-${index}` && searchResults.length > 0 && (
                <List component="nav"  style={{position:"absolute", zIndex:"1", width:"400px", maxHeight:"200px", overflow:"scroll"}}>
                  {searchResults.map((item) => (
                    <ListItem
                    style={{backgroundColor:"white"}}
                      key={item.place_id}
                      button
                      onClick={() => handleSelectLocation(item)}
                    >
                      <ListItemText primary={item.display_name} style={{ color:"black"}} />
                    </ListItem>
                  ))}
                </List>
              )}
            </div>
          ))}
          <Button variant="outlined" onClick={handleAddStop}>
            + Add Stop
          </Button>
        </div>

        <div>
          <h3 style={{color:"white"}}>End Point</h3>
          <OutlinedInput
            className="Route-start-point"
            value={inputValues.end}
            placeholder="Search end point"
            onChange={(e) => handleInputChange("end", e.target.value)}
          />
          {activeField === "end" && searchResults.length > 0 && (
            <List component="nav" style={{position:"absolute", zIndex:"1", width:"400px", maxHeight:"100px", overflow:"scroll"}}>
              {searchResults.map((item) => (
                <ListItem
                style={{backgroundColor:"white"}}
                  key={item.place_id}
                  button
                  onClick={() => handleSelectLocation(item)}
                >
                  <ListItemText primary={item.display_name} style={{ color:"black"}} />
                </ListItem>
              ))}
            </List>
          )}
        </div>

        <Button variant="contained" style={{ marginTop: '30px' }} onClick={handleRouteSubmit}>
          Plot Route
        </Button>

      </div>

      

      
    </>
  );
}