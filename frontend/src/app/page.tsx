"use client";

import React, { useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import TopBar from "./TopBar";

export default function Map() {
  const mapRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        version: "weekly",
      });

      const { Map } = await loader.importLibrary("maps");

      const position = {
        lat: -36.8484611,
        lng: 174.7597086,
      };

      // map options
      const mapOptions: google.maps.MapOptions = {
        center: position,
        zoom: 15,
        mapId: "MY_MAPS_MAPID",
      };

      //setup the map
      const map = new Map(mapRef.current as HTMLDivElement, mapOptions);
    };

    initMap();
  }, []);
  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex-grow z-0" ref={mapRef} />
    </div>
  );
}

/*"use client";
import React, { useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import TopBar from "./TopBar";

export default function Map() {
  const mapRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        version: "weekly",
      });

      const { Map } = await loader.importLibrary("maps");

      const position = {
        lat: -36.8484611,
        lng: 174.7597086,
      };

      const mapOptions: google.maps.MapOptions = {
        center: position,
        zoom: 15,
        mapId: "MY_MAPS_MAPID",
      };

      const map = new Map(mapRef.current as HTMLDivElement, mapOptions);
    };

    initMap();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex-grow" ref={mapRef} />
    </div>
  );
} */