"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type CurrencyCode = "USD" | "EUR" | "GBP" | "INR";

interface Currency {
  code: CurrencyCode;
  symbol: string;
  rate: number;
}

const currencies: Record<CurrencyCode, Currency> = {
  USD: { code: "USD", symbol: "$", rate: 1 },
  EUR: { code: "EUR", symbol: "€", rate: 0.92 },
  GBP: { code: "GBP", symbol: "£", rate: 0.79 },
  INR: { code: "INR", symbol: "₹", rate: 83.12 },
};

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (code: CurrencyCode) => void;
  convertPrice: (price: number) => number;
  formatPrice: (price: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(currencies.USD);

  useEffect(() => {
    const savedCurrency = localStorage.getItem("selectedCurrency");
    if (savedCurrency) {
      try {
        const parsed = JSON.parse(savedCurrency);
        const code = parsed.code as CurrencyCode;
        if (code && currencies[code]) {
          setCurrencyState(currencies[code]);
        }
      } catch {
        setCurrencyState(currencies.USD);
      }
    }
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    if (currencies[code]) {
      setCurrencyState(currencies[code]);
      localStorage.setItem("selectedCurrency", JSON.stringify(currencies[code]));
      window.dispatchEvent(new CustomEvent("currencyChanged", { detail: { currency: currencies[code] } }));
    }
  };

  const convertPrice = (price: number): number => {
    return Math.round(price * currency.rate * 100) / 100;
  };

  const formatPrice = (price: number): string => {
    const converted = convertPrice(price);
    return `${currency.symbol}${converted.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return context;
}
