import countryToCurrency, { Countries } from "country-to-currency";

/**
 * @name formatCurrency
 * @description Format the currency based on the currency code
 */
export function formatCurrency(params: {
  currencyCode: string;
  locale: string;
  value: string | number;
}) {
  return new Intl.NumberFormat(params.locale, {
    style: "currency",
    currency: params.currencyCode,
  }).format(Number(params.value));
}



// Fetch exchange rates (mock function, replace with real API call)
const fetchExchangeRate = async (currency: string): Promise<number> => {
  const response = await fetch(
    `https://api.exchangerate-api.com/v4/latest/${BASE_PRODUCT_CURRENCY}`
  );
  const data = await response.json();
  return data.rates[currency] || 1; // Default to 1 if currency not found
};

// Convert USD to local currency
export const convertToLocalCurrency = async (
  usdAmount: number,
  exchangeRate: number
): Promise<number> => {
  return usdAmount * exchangeRate;
};

const getUserCountry = async () => {
  

  try {
    const response = await fetch("https://ipinfo.io/json");
    const result = await response.json();
    const country = result?.country || "";
    return country;
  } catch (error) {
    console.error("Error fetching country:", error);
    return "";
  }
};

const cache_currency_key="user_currency"
export const getCachedCurrency = () => {
  const cachedCurrency = localStorage.getItem(cache_currency_key);
  if(!cachedCurrency) return "USD"
  return cachedCurrency;
}

export const cacheCurrency = (currency: string) => {
  localStorage.setItem(cache_currency_key, currency);
}

export const detectUserCurrency = async (): Promise<string> => {
  try {
    // const cachedCurrency= getCachedCurrency()
    
    // if (cachedCurrency) {
    //   return cachedCurrency;
    // }
    const userCountry: Countries = await getUserCountry()
    const currency = countryToCurrency[userCountry]
    // cacheCurrency(currency);
    return currency
  } catch (e) {
    console.error({ error: e });
    return "USD";
  }
};



export const BASE_PRODUCT_CURRENCY = "INR";

type PriceType = {
  Starter: {
    Monthly: number;
    Yearly: number;
  };
  Pro: {
    Monthly: number;
    Yearly: number;
  };
  Enterprise: {
    Monthly: number;
    Yearly: number;
  };
};

export const BASE_PRODUCT_PRICE: PriceType = {
  Starter: {
    Monthly: 1200,
    Yearly: 13800,
  },
  Pro: {
    Monthly: 1800,
    Yearly: 20400,
  },
  Enterprise: {
    Monthly: 2500,
    Yearly: 28800,
  },
};

// Convert BASE_PRODUCT_PRICE to the user's currency
export // Convert BASE_PRODUCT_PRICE to the user's currency while maintaining the PriceType structure
const convertBaseProductPrice = async (
  currency: string
): Promise<PriceType> => {
  const localizedPrices: PriceType = {
    Starter: {
      Monthly: 0,
      Yearly: 0,
    },
    Pro: {
      Monthly: 0,
      Yearly: 0,
    },
    Enterprise: {
      Monthly: 0,
      Yearly: 0,
    },
  };
  
  const exchangeRate = await fetchExchangeRate(currency);

  // Convert Starter prices
  localizedPrices.Starter.Monthly = await convertToLocalCurrency(
    BASE_PRODUCT_PRICE.Starter.Monthly,
    exchangeRate
  );
  localizedPrices.Starter.Yearly = await convertToLocalCurrency(
    BASE_PRODUCT_PRICE.Starter.Yearly,
    exchangeRate
  );

  // Convert Pro prices
  localizedPrices.Pro.Monthly = await convertToLocalCurrency(
    BASE_PRODUCT_PRICE.Pro.Monthly,
    exchangeRate
  );
  localizedPrices.Pro.Yearly = await convertToLocalCurrency(
    BASE_PRODUCT_PRICE.Pro.Yearly,
    exchangeRate
  );

  // Convert Enterprise prices
  localizedPrices.Enterprise.Monthly = await convertToLocalCurrency(
    BASE_PRODUCT_PRICE.Enterprise.Monthly,
    exchangeRate
  );
  localizedPrices.Enterprise.Yearly = await convertToLocalCurrency(
    BASE_PRODUCT_PRICE.Enterprise.Yearly,
    exchangeRate
  );

  return localizedPrices;
};
