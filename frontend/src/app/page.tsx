"use client";

import React, { useEffect, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import TopBar from "./TopBar";

export default function Map() {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [selectedFilter, setSelectedFilter] = useState("default");
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);

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
      const infoWindowInstance = new google.maps.InfoWindow();
      setInfoWindow(infoWindowInstance);

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

          marker.addListener("click", () => showPlaceDetails(place.place_id as string, marker, map, infoWindowInstance));
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
                marker.addListener("click", () => showPlaceDetails(place.place_id as string, marker, map, infoWindowInstance));
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

    const showPlaceDetails = (
      placeId: string,
      marker: google.maps.Marker,
      map: google.maps.Map,
      infoWindow: google.maps.InfoWindow
    ) => {
      const placesService = new google.maps.places.PlacesService(map);
    
      placesService.getDetails({ placeId }, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          let content = `<div style="color: black;font-family: Arial, sans-serif; padding: 10px; box-sizing: border-box;">
          <strong style="font-size: 16px; display: block; margin-bottom: 8px;">${place.name}</strong>
          ${place.rating ? `<div style="margin-bottom: 8px;">Rating: ${place.rating}</div>` : ''}
          ${place.formatted_phone_number ? `<div style="margin-bottom: 8px;">Phone: ${place.formatted_phone_number}</div>` : ''}
          ${place.opening_hours && place.opening_hours.weekday_text ? `<div style="margin-bottom: 8px;">Hours:<br/>${place.opening_hours.weekday_text.join('<br/>')}</div>` : `<div style="margin-bottom: 8px;">Hours: Not available</div>`}
          ${place.photos && place.photos.length > 0? `<img src="${place.photos[0].getUrl({ maxWidth: 200 })}" alt="Place image" style="max-width: 100%; margin-top: 8px;">`: ''}</div>`;

          infoWindow.setContent(content);
          infoWindow.open(map, marker);
        } else {
          console.log('Details not available', status);
        }
      });
    };
    

    initMap();
  }, [selectedFilter]);

  return (
    <div className="flex flex-col h-screen relative">
      <TopBar />
      {/* Map Container */}
      <div
        className="flex-grow h-full"
        ref={mapRef}
        style={{ minHeight: "500px" }}/>
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10 w-3/4 sm:w-1/2 lg:w-1/3">
        {/* Search Bar */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for places"
          className="w-full p-3 rounded-lg shadow-md border border-gray-300 focus:outline-none text-black"/>
      </div>
      {/* Filter Buttons */}
      <div className="absolute top-32 left-1/2 transform -translate-x-1/2 z-10 w-3/4 sm:w-1/2 lg:w-1/3 flex justify-center mt-4">
        <button
          onClick={() => setSelectedFilter("default")}
          className={`grow shrink basis-0 h-[33px] bg-[#ebebeb] rounded-[50px] justify-center items-center gap-2.5 flex mx-1 ${
            selectedFilter === "default" ? "bg-blue-500 text-white" : "text-black"}`}>
          Default
        </button>
        <button
          onClick={() => setSelectedFilter("restaurant")}
          className={`grow shrink basis-0 h-[33px] bg-[#ebebeb] rounded-[50px] justify-center items-center gap-2.5 flex mx-1 ${
            selectedFilter === "restaurant" ? "bg-blue-500 text-white" : "text-black"}`}>
          Restaurants
        </button>
        <button
          onClick={() => setSelectedFilter("lodging")}
          className={`grow shrink basis-0 h-[33px] bg-[#ebebeb] rounded-[50px] justify-center items-center gap-2.5 flex mx-1 ${
            selectedFilter === "lodging" ? "bg-blue-500 text-white" : "text-black"}`}>
          Hotels
        </button>
      </div>
    </div>
  );
}