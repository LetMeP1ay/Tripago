"use client"

import React, { useEffect } from "react";
import { Loader } from '@googlemaps/js-api-loader'

export function Map() {

  const mapRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {

    const initMap = async () => {

      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        version: 'weekly'
      });

      const { Map } = await loader.importLibrary('maps');
      //init a marker
      //const { Marker } = await loader.importLibrary('marker') as google.maps.MarkerLibrary;

      const position = {
        lat: -36.8484611, 
        lng: 174.7597086
      }

      // map options
      const mapOptions: google.maps.MapOptions = {
        center: position,
        zoom: 15,
        mapId: 'MY_MAPS_MAPID'
      }

      //setup the map
      const map = new Map(mapRef.current as HTMLDivElement, mapOptions)

      //put up marker
      /*const marker = new Marker({
        map: map,
        position: position
      });*/
    }

    initMap();
  }, []);
  return (
    <div style={{ height: '600px'}} ref={mapRef} />

  )
}