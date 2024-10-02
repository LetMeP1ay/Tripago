//for currency service country code https://restcountries.com/

export async function getCurrencyFromCountry(countryCode: string): Promise<string> {
    const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
    const data = await response.json();
    return data[0].currencies[Object.keys(data[0].currencies)[0]].code;
  }

  //for exchange rate https://www.exchangerate-api.com/
  
  export async function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
    const apiKey = '.env.EXCHANGE_RATE_API_KEY'; // Replace with your currency conversion API key
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`);
    const data = await response.json();
    return data.conversion_result;
  }
  