import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CurrencyDropdown from "@/components/CurrencyDropdown";

describe("CurrencyDropdown Component", () => {
  test("renders CurrencyDropdown component", () => {
    render(
      <CurrencyDropdown selectedCurrency="USD" onCurrencyChange={() => {}} />
    );
    const labelElement = screen.getByLabelText(/select currency/i);
    expect(labelElement).toBeInTheDocument();
  });

  test("renders all currency options", () => {
    render(
      <CurrencyDropdown selectedCurrency="USD" onCurrencyChange={() => {}} />
    );
    const options = screen.getAllByRole("option");
    const optionValues = options.map((option) => option.textContent);
    expect(optionValues).toEqual(["USD", "EUR", "GBP", "AUD", "NZD"]);
  });

  test("sets the selected currency based on props", () => {
    render(
      <CurrencyDropdown selectedCurrency="EUR" onCurrencyChange={() => {}} />
    );
    const selectElement = screen.getByLabelText(
      /select currency/i
    ) as HTMLSelectElement;
    expect(selectElement.value).toBe("EUR");
  });

  test("calls onCurrencyChange when a new currency is selected", () => {
    const handleCurrencyChange = jest.fn();
    render(
      <CurrencyDropdown
        selectedCurrency="USD"
        onCurrencyChange={handleCurrencyChange}
      />
    );

    const selectElement = screen.getByLabelText(/select currency/i);
    fireEvent.change(selectElement, { target: { value: "GBP" } });

    expect(handleCurrencyChange).toHaveBeenCalledTimes(1);
    expect(handleCurrencyChange).toHaveBeenCalledWith("GBP");
  });
});
