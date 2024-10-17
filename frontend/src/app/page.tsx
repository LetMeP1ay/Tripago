"use client";

import React, { useEffect, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

export default function Map() {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [selectedFilter, setSelectedFilter] = useState("default");
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        version: "weekly",
        libraries: ["places"],
      });

      await loader.load();

      const map = new google.maps.Map(mapRef.current as HTMLDivElement, {
        center: { lat: -36.8484611, lng: 174.7597086 },
        zoom: 15,
        mapId: "MY_MAPS_MAPID",
        disableDefaultUI: true,
      });

      const input = inputRef.current as HTMLInputElement;
      const searchBox = new google.maps.places.SearchBox(input);

      map.addListener("bounds_changed", () => {
        searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
      });

      searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();
        if (!places || places.length === 0) return;

        markers.forEach((marker) => marker.setMap(null));
        setMarkers([]);
        const bounds = new google.maps.LatLngBounds();

        places.forEach((place) => {
          if (!place.geometry || !place.geometry.location) 
            return;

          const marker = new google.maps.Marker({
            map,
            position: place.geometry.location,
            title: place.name,
          });

          setMarkers((prevMarkers) => [...prevMarkers, marker]);

            bounds.extend(place.geometry.location);
        });

        map.fitBounds(bounds);
      });

      if (selectedFilter !== "default") {
        const request = {
          location: map.getCenter(),
          radius: 5000,
          types: [selectedFilter],
        };

        const placesService = new google.maps.places.PlacesService(map);
        placesService.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            markers.forEach((marker) => marker.setMap(null));
            setMarkers([]);

            const newMarkers: google.maps.Marker[] = [];
            const bounds = new google.maps.LatLngBounds();
            results.forEach((place) => {
              if (place.geometry?.location) {
                const marker = new google.maps.Marker({
                  map,
                  position: place.geometry.location,
                  title: place.name,
                });
                newMarkers.push(marker);
                bounds.extend(place.geometry.location);
              }
            });

            setMarkers(newMarkers);
            map.fitBounds(bounds);
          } else {
            console.log('no places found', status)
          }
        });
      }
    };

    initMap();
  }, [selectedFilter]);

  return (
    <div className="flex flex-col h-screen relative">
      {/* Map Container */}
      <div
        className="flex-grow h-full"
        ref={mapRef}
        style={{ minHeight: "500px" }}
      />
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10 w-3/4 sm:w-1/2 lg:w-1/3">
        {/* Search Bar */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for places"
          className="w-full p-3 rounded-lg shadow-md border border-gray-300 focus:outline-none text-black"
        />
      </div>
      {/* Filter Dropdown */}
      <div className="absolute top-28 left-1/2 transform -translate-x-1/2 z-10 w-3/4 sm:w-1/2 lg:w-1/3 flex justify-center mt-4 text-black">
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="w-full p-3 rounded-lg shadow-md border border-gray-300 focus:outline-none"
        >
          <option value="default">Default</option>
          <option value="restaurant">Restaurants</option>
          <option value="lodging">Hotels</option>
        </select>
      </div>
    </div>
  );
}
