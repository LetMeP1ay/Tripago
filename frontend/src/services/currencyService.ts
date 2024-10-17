//for currency service country code https://restcountries.com/

export async function getCurrencyFromCountry(
  countryCode: string
): Promise<string> {
  const response = await fetch(
    `https://restcountries.com/v3.1/alpha/${countryCode}?fields=currencies`
  );
  const data = await response.json();
  return Object.keys(data.currencies)[0];
}

//for exchange rate https://www.exchangerate-api.com/

export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<number> {
  const apiKey = `${process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY}`; // Replace with your currency conversion API key
  const response = await fetch(
    `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`
  );
  const data = await response.json();
  return data.conversion_result;
}
