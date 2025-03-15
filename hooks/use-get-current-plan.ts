import { useState, useEffect } from "react";



const useGetCurrentPlan = () => {
  const user = { id: "1", name: "vinod", email: "vinod@gmail.com" };
  const [plan, setPlan] = useState<undefined | string>(undefined);

  useEffect(() => {
    (async () => {
      const response = await fetch(`/api/billing/subscription/${user.id}`)
      const result = await response.json();
      console.log({User_plan_plan_plan: result.data})
      setPlan(result.data)
    })()
  }, [user.id]);

  return plan;

};

export default useGetCurrentPlan;

