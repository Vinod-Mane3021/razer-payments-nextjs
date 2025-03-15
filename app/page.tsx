"use client"

import { Pricing } from "@/components/pricing";
import useGetCurrentPlan from "@/hooks/use-get-current-plan";

export default function Home() {

  const plan = useGetCurrentPlan()

  return (
    <div className=" overflow-y-auto flex items-center justify-center flex-col">
      <p className="text-xl font-semibold">current plane - <span className="font-bold">{plan}</span></p>
      <Pricing/>
    </div>
  );
}