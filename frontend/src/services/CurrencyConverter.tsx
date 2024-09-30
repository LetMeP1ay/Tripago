// UI integration: will be moved later
// This is just a dummy component to test the service

import React, { useState } from 'react';
import { getUserCurrencyConversion } from '../services/currencyConversion';

const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<number>(0);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);

  const handleConvert = async () => {
    try {
      const result = await getUserCurrencyConversion(amount, 'USD'); // Convert to USD for example
      setConvertedAmount(result);
    } catch (error) {
      console.error("Conversion failed", error);
    }
  };

  return (
    <div>
      <h2>Currency Converter</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(parseFloat(e.target.value))}
        placeholder="Enter amount"
      />
      <button onClick={handleConvert}>Convert</button>
      {convertedAmount !== null && (
        <p>Converted Amount: {convertedAmount}</p>
      )}
    </div>
  );
};

export default CurrencyConverter;
