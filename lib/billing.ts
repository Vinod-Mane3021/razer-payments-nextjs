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

// Add currency-based amount calculation
export const getAmountInSubunits = (currency: string): number => {
  const priceMap: { [key: string]: number } = {
    INR: 100 * 100, // ₹100
    USD: 10 * 100, // $10
    EUR: 10 * 100, // €10
    GBP: 10 * 100, // £10
    JPY: 1000, // ¥1000
    AUD: 15 * 100, // AU$15
  };

  return priceMap[currency] || 10 * 100;
};

export const getLocaleForCurrency = (currency: string): string => {
  const currencyToLocaleMap: { [key: string]: string } = {
    USD: "en-US",
    INR: "en-IN",
    JPY: "ja-JP",
    EUR: "de-DE",
    GBP: "en-GB",
    AUD: "en-AU",
    CAD: "en-CA",
    SGD: "en-SG",
  };
  return currencyToLocaleMap[currency] || "en-US"; // Default to en-US
};

// Fetch exchange rates (mock function, replace with real API call)
const fetchExchangeRate = async (currency: string): Promise<number> => {
  const response = await fetch(
    `https://api.exchangerate-api.com/v4/latest/USD`
  );
  const data = await response.json();
  return data.rates[currency] || 1; // Default to 1 if currency not found
};

// Convert USD to local currency
export const convertToLocalCurrency = async (
  usdAmount: number,
  currency: string
): Promise<number> => {
  const exchangeRate = await fetchExchangeRate(currency);
  return usdAmount * exchangeRate;
};

export const detectUserCurrency = (): string => {
  try {
    const locale = navigator.language || "en-US";
    console.log({ locale });
    const region = locale.split("-")[1];

    const currencyMap: { [key: string]: string } = {
      IN: "INR",
      US: "USD",
      GB: "GBP",
      AU: "AUD",
      CA: "CAD",
      JP: "JPY",
      SG: "SGD",
    };

    return currencyMap[region] || "USD";
  } catch (e) {
    console.error({ error: e });
    return "USD";
  }
};

export const BASE_PRODUCT_CURRENCY = "USD";

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
    Monthly: 5.99,
    Yearly: 59.9,
  },
  Pro: {
    Monthly: 19.99,
    Yearly: 199.99,
  },
  Enterprise: {
    Monthly: 29.99,
    Yearly: 299.9,
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

  // Convert Starter prices
  localizedPrices.Starter.Monthly = await convertToLocalCurrency(
    BASE_PRODUCT_PRICE.Starter.Monthly,
    currency
  );
  localizedPrices.Starter.Yearly = await convertToLocalCurrency(
    BASE_PRODUCT_PRICE.Starter.Yearly,
    currency
  );

  // Convert Pro prices
  localizedPrices.Pro.Monthly = await convertToLocalCurrency(
    BASE_PRODUCT_PRICE.Pro.Monthly,
    currency
  );
  localizedPrices.Pro.Yearly = await convertToLocalCurrency(
    BASE_PRODUCT_PRICE.Pro.Yearly,
    currency
  );

  // Convert Enterprise prices
  localizedPrices.Enterprise.Monthly = await convertToLocalCurrency(
    BASE_PRODUCT_PRICE.Enterprise.Monthly,
    currency
  );
  localizedPrices.Enterprise.Yearly = await convertToLocalCurrency(
    BASE_PRODUCT_PRICE.Enterprise.Yearly,
    currency
  );

  return localizedPrices;
};
