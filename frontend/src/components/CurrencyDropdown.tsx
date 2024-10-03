// UI integration: will be moved later
// This is just a dummy component to test the service

import React, { useState } from 'react';
import { getUserCurrencyConversion } from '../services/currencyConversion';

interface CurrencyDropdownProps {
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
}

const CurrencyDropdown: React.FC<CurrencyDropdownProps> = ({selectedCurrency, onCurrencyChange}: CurrencyDropdownProps) => {
  const [amount, setAmount] = useState<number>(0);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);

  const currencies = ['USD', 'EUR', 'GBP', "AUD", "NZD"]

  return (
    <div className='flex flex-col items-center'>
      <label htmlFor="currency">
        Select Currency
      </label>
      <select id="currency" value={selectedCurrency} onChange={(e) => onCurrencyChange(e.target.value)}>
        {currencies.map((currency) => (
          <option key={currency} value={currency}>{currency}</option>
        ))}
      </select>
    </div>
  );
};

export default CurrencyDropdown;
