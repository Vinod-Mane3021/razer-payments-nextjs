import { useEffect, useState } from "react";
import { cacheCurrency, detectUserCurrency } from "@/lib/billing";

export const useDetectUserCurrency = () => {
  const [userCurrency, setUserCurrency] = useState<null | string>(null);

  useEffect(() => {
    const fetchCurrency = async () => {
      const currency = await detectUserCurrency();
      setUserCurrency(currency);
    };

    fetchCurrency();
  }, []);

  const onChangeCurrency = (currency: string) => {
    cacheCurrency(currency);
    setUserCurrency(currency);
  }

  return { userCurrency, onChangeCurrency };
};
