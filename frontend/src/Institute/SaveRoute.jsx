import React from 'react';
// import { Link } from 'react-router-dom';


const SaveRoute = ({ routePoints }) => {
  if (!routePoints || routePoints.length === 0) {
    return <div>No route points available to save.</div>;
  }

  const handleSave = () => {
    const routeData = JSON.stringify(routePoints, null, 2); 
    const blob = new Blob([routeData], { type: 'application/json' }); 
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'route.json'; 
    document.body.appendChild(a);
    a.click(); 
    document.body.removeChild(a); 
    URL.revokeObjectURL(url);
    localStorage.setItem('savedRoute', routeData);
  };

  return (
    <>
    
 
                <div className="add-vehicle-submit-btn-container" onClick={handleSave} style={{display:'flex',justifyContent:'right', marginRight:'30px'}}>
                        <input type="submit" value="Register" className="add-vehicle-submit-btn" />
                </div>
    <div>

    </div>
    </>
    
  );
};

export default SaveRoute;
