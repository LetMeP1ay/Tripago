"use client";

import React, { useEffect, useState } from "react";
import React, { useEffect, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import TopBar from "./TopBar";
import { Rating } from "@mui/material";
import ReactDOM from "react-dom";

export default function Map() {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [selectedFilter, setSelectedFilter] = useState("default");
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);
  const [radius, setRadius] = useState<number>(5000);
  const [latitude, setLatitude] = useState<number>();
  const [longitude, setLongitude] = useState<number>();

  useEffect(() => {

    const getLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        }, (error) => {
          if (error) {
            setLatitude(-36.8484611);
            setLongitude(174.7597086);
          }
        })
      }
    };

    const initMap = async (lat: number, lon: number) => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        version: "weekly",
        libraries: ["places"],
        libraries: ["places"],
      });

      await loader.load();

      const map = new google.maps.Map(mapRef.current as HTMLDivElement, {
        center: { lat: lat, lng: lon },
        zoom: 15,
        mapId: "MY_MAPS_MAPID",
        disableDefaultUI: true,
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
          radius: radius,
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
          const headerDiv = document.createElement('div');
          const contentDiv = document.createElement('div');

          headerDiv.style.color = 'black';
          headerDiv.style.fontFamily = 'Arial, sans-serif';
          headerDiv.style.padding = '10px';
          headerDiv.style.boxSizing = 'border-box';

          const ratingContainer = document.createElement('div');
          ratingContainer.style.display = 'flex';
          ratingContainer.style.alignItems = 'center';

          const ratingText = document.createElement('span');
          ratingText.innerHTML = `${place.rating}`;
          const ratingCount = document.createElement("span");
          ratingCount.innerHTML = `(${place.user_ratings_total})`;
          ratingContainer.appendChild(ratingText);

          const ratingDiv = document.createElement('div');
          ratingDiv.style.marginLeft = '8px';
          ratingDiv.style.marginRight = '8px';
          ratingContainer.appendChild(ratingDiv);
          ratingContainer.appendChild(ratingCount);

          headerDiv.innerHTML = `
            <strong style="font-size: 16px; display: block; margin-bottom: 8px;">${place.name}</strong>
            ${place.formatted_phone_number ? `<div style="margin-bottom: 8px;">Phone: ${place.formatted_phone_number}</div>` : ''}
          `;

          headerDiv.appendChild(ratingContainer);
          headerDiv.appendChild(contentDiv);

          ReactDOM.render(
            <Rating value={place.rating || 0} precision={0.1} readOnly />,
            ratingDiv
          );

          contentDiv.innerHTML = `
            ${place.opening_hours && place.opening_hours.weekday_text ?
              `<div style="margin-bottom: 8px;">Hours:<br/>${place.opening_hours.weekday_text.join('<br/>')}</div>` :
              `<div style="margin-bottom: 8px;">Hours: Not available</div>`
            }
            ${place.photos && place.photos.length > 0 ? `<img src="${place.photos[0].getUrl({ maxWidth: 200 })}" alt="Place image" style="max-width: 100%; margin-top: 8px;">` : ''}
          `;

          infoWindow.setContent(headerDiv);
          infoWindow.open(map, marker);
        } else {
          console.log('Details not available', status);
        }
      });
    };
    getLocation();
    if (latitude && longitude) { initMap(latitude, longitude); }
  }, [selectedFilter, latitude, longitude]);


  if (!latitude && !longitude) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-black"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }


  return (
    <div className="flex flex-col h-screen relative">
      <TopBar />
      {/* Map Container */}
      <div
        className="flex-grow h-full"
        ref={mapRef}
        style={{ minHeight: "500px" }} />
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10 w-3/4 sm:w-1/2 lg:w-1/3">
        {/* Search Bar */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for places"
          className="w-full p-3 rounded-lg shadow-md border border-gray-300 focus:outline-none text-black" />
      </div>
      {/* Filter Buttons */}
      <div className="absolute top-32 left-1/2 transform -translate-x-1/2 z-10 w-3/4 sm:w-1/2 lg:w-1/3 flex justify-center mt-4">
        <button
          onClick={() => setSelectedFilter("default")}
          className={`grow shrink basis-0 h-[33px] bg-[#ebebeb] rounded-[50px] justify-center items-center gap-2.5 flex mx-1 ${selectedFilter === "default" ? "bg-blue-500 text-white" : "text-black"}`}>
          Default
        </button>
        <button
          onClick={() => setSelectedFilter("restaurant")}
          className={`grow shrink basis-0 h-[33px] bg-[#ebebeb] rounded-[50px] justify-center items-center gap-2.5 flex mx-1 ${selectedFilter === "restaurant" ? "bg-blue-500 text-white" : "text-black"}`}>
          Restaurants
        </button>
        <button
          onClick={() => setSelectedFilter("lodging")}
          className={`grow shrink basis-0 h-[33px] bg-[#ebebeb] rounded-[50px] justify-center items-center gap-2.5 flex mx-1 ${selectedFilter === "lodging" ? "bg-blue-500 text-white" : "text-black"}`}>
          Hotels
        </button>
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