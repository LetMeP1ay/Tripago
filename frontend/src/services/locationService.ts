//Testing https://opencagedata.com/pricing for API key, its FREE

export function getUserLocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      } else {
        reject(new Error("Geolocation is not supported by this browser."));
      }
    });
  }
  
  export async function getCountryFromCoordinates(lat: number, lon: number): Promise<string> {
    const apiKey = '.env.COUNTRY_API_KEY'; // Replace with your API key
    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}`);
    const data = await response.json();
    return data.results[0].components.country_code.toUpperCase();
  }
  