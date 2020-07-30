import React, { useState, useEffect } from 'react';
import { Map, Marker, CircleMarker, Polygon, TileLayer } from 'react-leaflet'
import './App.css';

function App() {
  const [centralPoint, setCentralPoint] = useState([-7.2281, -35.8739]);
  const [pointsArray, setPointsArray] = useState([]);
  const [zoom, setZoom] = useState(18);
  const [isCircleEvent, setIsCircleEvent] = useState(false);
  const [wkt, setWkt] = useState("");

  useEffect(() => {
    if(pointsArray.length === 1){
      setWkt(`POINT(${pointsArray[0].lat} ${pointsArray[0].lng})`);
    }else if(pointsArray.length === 2){
      setWkt(`LINESTRING(${pointsArray[0].lat} ${pointsArray[0].lng}, ${pointsArray[1].lat} ${pointsArray[1].lng})`);
    }else if(pointsArray.length > 2){
      let newWkt = "POLYGON(";

      pointsArray.map(point => newWkt += `${point.lat} ${point.lng},`);
      setWkt(newWkt.replace(/.$/,")"));
    }
  }, [pointsArray])

  const handleClick = (event) => {
    if(!isCircleEvent){
      const coords = event.latlng;

      setPointsArray([...pointsArray, coords]);
    }
    setIsCircleEvent(false);
  }

  return (
    <div className='container'>
      <Map  center={centralPoint} 
            zoom={zoom}
            onclick={handleClick}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />

        <ul>
        {
          pointsArray.map((point, ind) => 
            <li key={ind}>
              <CircleMarker
                center={[point.lat, point.lng]}
                radius={4}
                weight={2}
                color="#ef5350"
                onclick={() => {
                  setIsCircleEvent(true);
                  setPointsArray(pointsArray.filter(p => p !== point));
                }}
                >
              </CircleMarker>
            </li>
          )
        }
        </ul>

        {
          (pointsArray.length > 1) &&
          <Polygon 
            positions={pointsArray.map(point => [point.lat, point.lng])}
            color="#ef5350"
            >
          </Polygon>
        }

        <button  className="reset" onClick={() => {
            setPointsArray([]);
          }}>
            Resetar
        </button>                
      </Map>

     <aside>
      <form>
        <label htmlFor='wktTextField'><h2>WKT Representation of the Polygon</h2></label>
        <textarea id='wktTextField' rows='20' placeholder='Click on the map to start drawing your polygon' value={wkt} readOnly>
        </textarea>
      </form>
     </aside>
    </div>
  );
}

export default App;
