'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { detectCurrencyFromTimezone, fetchExchangeRates, convertPrice, formatPrice, type CurrencyInfo } from '@/lib/currency';

type CurrencyContextType = {
  currency: CurrencyInfo;
  rates: Record<string, number> | null;
  loading: boolean;
  format: (amountPKR: number) => string;
  convert: (amountPKR: number) => number;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<CurrencyInfo>({ code: 'PKR', symbol: '₨', name: 'Pakistani Rupee' });
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const detected = detectCurrencyFromTimezone();
    setCurrency(detected);

    fetchExchangeRates(detected.code).then((r) => {
      setRates(r);
      setLoading(false);
    });
  }, []);

  const convert = (amountPKR: number) => convertPrice(amountPKR, rates, currency.code);
  const format = (amountPKR: number) => formatPrice(convert(amountPKR), currency);

  return (
    <CurrencyContext.Provider value={{ currency, rates, loading, format, convert }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
}
