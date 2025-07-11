'use client'
import dynamic from 'next/dynamic';

import React, { useState, useEffect, use ,createContext } from 'react';
import Menu from '../components/Menu';
import Link from "next/link";

import BuisinessSearchBox from '../components/BuisinessSearchBox';
import ProvinceSearchBox from '../components/ProvinceSearchbox';


const MapComponent = dynamic(() => import('../components/MapComponent.jsx'), {
  ssr: false,
});

export default function MapPage() {
  const [button, setButton] = useState({
        area: 1,
        type: 1,
        data: 1
  });
  const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [factory_type, setType] = useState([]);
  const [lst, setLst] = useState([]);
  const [coor, setCoor] = useState(null);
  const [markers, setMarkers] = useState(null);


const fetchCoor = async () => {
  if (lst && lst.length > 0) {
        const codes = lst.map(obj => obj.code);
        const url = `${backend_url}/coor?code=\"${codes.join(',')}\"`;
        console.log("Fetching:", url);

    try {
      const res = await fetch(url);
      const data = await res.json(); // Assuming backend returns JSON

      // If the response is a stringified GeoJSON, parse it again
      const json = typeof data === 'string' ? JSON.parse(data) : data;

      setCoor(json);
    } catch (err) {
      console.error('Error fetching:', err);
      setCoor(null);
    }
  } else {
    setCoor(null);
  }
};

const fetchMarker = async () => {
  if (lst && lst.length > 0) {
        const codes = lst.map(obj => obj.code);
        const url = `${backend_url}/factory?code=\"${codes.join(',')}\"&type=\"${factory_type}\"`;
        console.log("Fetching:", url);

    try {
      const res = await fetch(url);
      const data = await res.json(); // Assuming backend returns JSON

      // If the response is a stringified GeoJSON, parse it again
      const json = typeof data === 'string' ? JSON.parse(data) : data;

      setMarkers(json);
    } catch (err) {
      console.error('Error fetching:', err);
      setMarkers(null);
    }
  } else {
    setMarkers(null);
  }
};


  useEffect(() => {
    fetchCoor();
    fetchMarker();
  }, [lst, backend_url]);

  return (<div className='w-[100vw] h-[100vh] flex'>
    <Menu children={[<ProvinceSearchBox show={button.area} lst={lst} setLst={setLst} baseUrl={backend_url} />,<BuisinessSearchBox show={button.type}  baseUrl={backend_url}/>]} buttonSetAbove={setButton}/>
     <MapComponent geoJsonObj={coor} markers={markers}/>
     </div>)
}