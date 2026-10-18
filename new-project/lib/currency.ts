export type CurrencyInfo = {
  code: string;
  symbol: string;
  name: string;
};

// Timezone → currency mapping (covers most common timezones)
const timezoneToCurrency: Record<string, CurrencyInfo> = {
  // Pakistan
  'Asia/Karachi': { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee' },
  // UAE
  'Asia/Dubai': { code: 'AED', symbol: 'AED', name: 'UAE Dirham' },
  // Saudi Arabia
  'Asia/Riyadh': { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal' },
  // UK
  'Europe/London': { code: 'GBP', symbol: '£', name: 'British Pound' },
  // US
  'America/New_York': { code: 'USD', symbol: '$', name: 'US Dollar' },
  'America/Chicago': { code: 'USD', symbol: '$', name: 'US Dollar' },
  'America/Denver': { code: 'USD', symbol: '$', name: 'US Dollar' },
  'America/Los_Angeles': { code: 'USD', symbol: '$', name: 'US Dollar' },
  // Canada
  'America/Toronto': { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  'America/Vancouver': { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  // Europe (Eurozone)
  'Europe/Paris': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Europe/Berlin': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Europe/Madrid': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Europe/Rome': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Europe/Amsterdam': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Europe/Dublin': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Europe/Brussels': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Europe/Vienna': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Europe/Athens': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Europe/Helsinki': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Europe/Lisbon': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Europe/Luxembourg': { code: 'EUR', symbol: '€', name: 'Euro' },
  // India
  'Asia/Kolkata': { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  // Bangladesh
  'Asia/Dhaka': { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka' },
  // Singapore
  'Asia/Singapore': { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  // Malaysia
  'Asia/Kuala_Lumpur': { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  // Indonesia
  'Asia/Jakarta': { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  // Thailand
  'Asia/Bangkok': { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  // China
  'Asia/Shanghai': { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  'Asia/Hong_Kong': { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  // Japan
  'Asia/Tokyo': { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  // South Korea
  'Asia/Seoul': { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  // Australia
  'Australia/Sydney': { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  'Australia/Melbourne': { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  // New Zealand
  'Pacific/Auckland': { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
  // South Africa
  'Africa/Johannesburg': { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  // Egypt
  'Africa/Cairo': { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound' },
  // Nigeria
  'Africa/Lagos': { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  // Turkey
  'Europe/Istanbul': { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  // Switzerland
  'Europe/Zurich': { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  // Sweden
  'Europe/Stockholm': { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  // Norway
  'Europe/Oslo': { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  // Denmark
  'Europe/Copenhagen': { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
  // Poland
  'Europe/Warsaw': { code: 'PLN', symbol: 'zł', name: 'Polish Zloty' },
  // Qatar
  'Asia/Qatar': { code: 'QAR', symbol: 'QAR', name: 'Qatari Riyal' },
  // Kuwait
  'Asia/Kuwait': { code: 'KWD', symbol: 'KWD', name: 'Kuwaiti Dinar' },
  // Bahrain
  'Asia/Bahrain': { code: 'BHD', symbol: 'BHD', name: 'Bahraini Dinar' },
  // Oman
  'Asia/Muscat': { code: 'OMR', symbol: 'OMR', name: 'Omani Rial' },
};

const DEFAULT_CURRENCY: CurrencyInfo = { code: 'USD', symbol: '$', name: 'US Dollar' };

const EXCHANGE_RATE_API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY || '';
const RATES_CACHE_KEY = 'tag-educators-rates';
const RATES_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export function detectCurrencyFromTimezone(): CurrencyInfo {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return timezoneToCurrency[tz] ?? DEFAULT_CURRENCY;
  } catch {
    return DEFAULT_CURRENCY;
  }
}

type CachedRates = {
  rates: Record<string, number>;
  base: string;
  fetchedAt: number;
};

export async function fetchExchangeRates(targetCurrency: string): Promise<Record<string, number> | null> {
  // Check cache first
  try {
    const cached = localStorage.getItem(RATES_CACHE_KEY);
    if (cached) {
      const parsed: CachedRates = JSON.parse(cached);
      if (Date.now() - parsed.fetchedAt < RATES_CACHE_DURATION && parsed.rates[targetCurrency]) {
        return parsed.rates;
      }
    }
  } catch {}

  try {
    const res = await fetch(`https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/latest/USD`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.result !== 'success' || !data.conversion_rates) return null;

    const rates = data.conversion_rates as Record<string, number>;
    // Cache the full rates object
    const toCache: CachedRates = { rates, base: 'USD', fetchedAt: Date.now() };
    try {
      localStorage.setItem(RATES_CACHE_KEY, JSON.stringify(toCache));
    } catch {}

    return rates;
  } catch {
    return null;
  }
}

export function convertPrice(amountPKR: number, rates: Record<string, number> | null, targetCurrency: string): number {
  if (!rates || !rates[targetCurrency] || !rates['PKR']) return amountPKR;
  // Convert PKR → USD → target
  const usdAmount = amountPKR / rates['PKR'];
  return usdAmount * rates[targetCurrency];
}

export function formatPrice(amount: number, currency: CurrencyInfo): string {
  const rounded = Math.round(amount);
  return `${currency.symbol} ${rounded.toLocaleString()}`;
}
