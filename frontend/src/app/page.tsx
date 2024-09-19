"use client";

import React, { useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import TopBar from "./TopBar";

export default function Map() {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        version: "weekly",
        libraries: ["places"], // Add the Places library
      });

      // Load the libraries
      await loader.load();

      // Initialize the map
      const map = new google.maps.Map(mapRef.current as HTMLDivElement, {
        center: { lat: -36.8484611, lng: 174.7597086 },
        zoom: 15,
        mapId: "MY_MAPS_MAPID",
      });

      // Create the search box and link it to the UI element.
      const input = inputRef.current as HTMLInputElement;
      const searchBox = new google.maps.places.SearchBox(input);
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

      // Bias the SearchBox results towards current map's viewport.
      map.addListener("bounds_changed", () => {
        searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
      });

      searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();
        if (!places || places.length === 0) return;

        // Clear out the old markers.
        const bounds = new google.maps.LatLngBounds();

        places.forEach((place) => {
          if (!place.geometry || !place.geometry.location) {
            console.log("Returned place contains no geometry");
            return;
          }

          // Extend the boundaries of the map for each place.
          if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });

        map.fitBounds(bounds);
      });
    };

    initMap();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="relative flex-grow">
        {/* Custom Search Bar */}
        <div className="absolute top-6 left-0 right-0 z-10 px-4">
          <div className="max-w-xl mx-auto">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for places"
              className="w-full p-2 border rounded-lg shadow-md"
            />
          </div>
        </div>
        {/* Map Container */}
        <div className="absolute inset-0" ref={mapRef} />
      </div>
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