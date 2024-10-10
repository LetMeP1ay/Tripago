// feature: will move to components later

import {
  getUserLocation,
  getCountryFromCoordinates,
} from "../services/locationService";
import {
  getCurrencyFromCountry,
  convertCurrency,
} from "../services/currencyService";

export async function getUserCurrencyConversion(
  amount: number,
  toCurrency: string
): Promise<number> {
  try {
    const position = await getUserLocation();
    const country = await getCountryFromCoordinates(
      position.coords.latitude,
      position.coords.longitude
    );
    const userCurrency = await getCurrencyFromCountry(country);
    const convertedAmount = await convertCurrency(
      amount,
      userCurrency,
      toCurrency
    );
    return convertedAmount;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
