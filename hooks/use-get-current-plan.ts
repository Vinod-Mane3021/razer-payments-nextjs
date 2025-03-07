import { useState, useEffect } from "react";

const useGetCurrentPlan = () => {
  const [plan, setPlan] = useState<undefined | string>(undefined);

  useEffect(() => {
    const storedPlan = localStorage.getItem("currentPlan");
    if (storedPlan) {
      setPlan(JSON.parse(storedPlan));
    }
  }, []);

  return plan;
};

export default useGetCurrentPlan;
