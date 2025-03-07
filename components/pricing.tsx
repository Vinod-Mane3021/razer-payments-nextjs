"use client"

import React from 'react';
import { SecondaryHero } from './secondary-hero';
import { Pill } from './pill';
import { PricingTable } from './pricing-table';
import { useGetBillingConfig } from '@/hooks/use-billing-config';

export const Pricing = () => {

  const { billingConfig } = useGetBillingConfig()

  if(!billingConfig) {
    return null
  }

  return (
    <div className={'container mx-auto'}>
      <div
        className={'flex flex-col items-center justify-center space-y-16 py-16'}
      >
        <SecondaryHero
          pill={<Pill>Get started for free. No credit card required.</Pill>}
          heading="Fair pricing for all types of businesses"
          subheading="Get started on our free plan and upgrade when you are ready."
        />

        <div className={'w-full'}>
          <PricingTable
            config={billingConfig}
            paths={{
              signUp: "/auth/sign-up",
              return: "/",
            }}
          />
        </div>
      </div>
    </div>
  );
};
