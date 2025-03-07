import { useState, useEffect } from "react";
import { convertBaseProductPrice, detectUserCurrency } from "@/lib/billing";
import { BillingConfig, createBillingSchema } from "@/schema/billing";

export function useGetBillingConfig() {
  const [billingConfig, setBillingConfig] = useState<BillingConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBillingSchema() {
      try {
        setLoading(true);
        const currency = detectUserCurrency();
        const localizedPrices = await convertBaseProductPrice(currency);

        const schema: BillingConfig = createBillingSchema({
          provider: "razorpay",
          products: [
            // Starter
            {
              id: "starter",
              name: "Starter",
              description: "The perfect plan to get started",
              currency,
              badge: `Value`,
              plans: [
                {
                  name: "Starter Monthly",
                  id: "starter-monthly",
                  paymentType: "recurring",
                  interval: "month",
                  lineItems: [
                    {
                      id: "pri_01ja7smmrwdfw3w4stkt4bm03v",
                      name: "Starter",
                      cost: localizedPrices.Starter.Monthly,
                      type: "flat" as const,
                    },
                  ],
                },
                {
                  name: "Starter Yearly",
                  id: "starter-yearly",
                  paymentType: "recurring",
                  interval: "year",
                  lineItems: [
                    {
                      id: "pri_01ja7spbegts542cctrhanvqt5",
                      name: "Base",
                      cost: localizedPrices.Starter.Yearly,
                      type: "flat" as const,
                    },
                  ],
                },
              ],
              type: "price",
              features: [
                "5 files/month",
                "10 MB per document",
                "Basic insights: Totals, averages, trends",
                "Standard templates",
                "Predefined themes only",
                "Community-based, 48-hour  email response",
              ],
            },
            // Pro
            {
              id: "pro",
              name: "Pro",
              badge: `Popular`,
              highlighted: true,
              description: "The perfect plan for professionals",
              currency,
              plans: [
                {
                  name: "Pro Monthly",
                  id: "pro-monthly",
                  paymentType: "recurring",
                  interval: "month",
                  lineItems: [
                    {
                      id: "pri_01ja7ssjnb9czx6ktw9h4a1ztt",
                      name: "Base",
                      cost: localizedPrices.Pro.Monthly,
                      type: "flat",
                    },
                  ],
                },
                {
                  name: "Pro Yearly",
                  id: "pro-yearly",
                  paymentType: "recurring",
                  interval: "year",
                  lineItems: [
                    {
                      id: "pri_01ja7stacgz4q0q6jvgtnvx9a4",
                      name: "Base",
                      cost: localizedPrices.Pro.Yearly,
                      type: "flat",
                    },
                  ],
                },
              ],
              type: "price",
              features: [
                "10 files/month",
                "50MB per document",
                "Advanced AI insights: Trends, forecasts, anomalies",
                "Customizable templates (branding options)",
                "All themes & unlimited queries",
                "Priority email, 24-hour response",
              ],
            },
            // Enterprise
            {
              id: "enterprise",
              name: "Enterprise",
              description: "The perfect plan for enterprises",
              currency,
              plans: [
                {
                  name: "Enterprise Monthly",
                  id: "enterprise-monthly",
                  paymentType: "recurring",
                  interval: "month",
                  lineItems: [
                    {
                      id: "pri_01ja7sw35ywx0ske3mc7nby46z",
                      name: "Base",
                      cost: localizedPrices.Enterprise.Monthly,
                      type: "flat",
                    },
                  ],
                },
                {
                  name: "Enterprise Yearly",
                  id: "enterprise-yearly",
                  paymentType: "recurring",
                  interval: "year",
                  lineItems: [
                    {
                      id: "pri_01ja7sx131806nzprpw6dxwvkk",
                      name: "Base",
                      cost: localizedPrices.Enterprise.Yearly,
                      type: "flat",
                    },
                  ],
                },
              ],
              type: "custom",
              features: [
                "Custom # file/months",
                "Custom MB per document",
                "Fully tailored AI insights: predictive analytics, segmentation",
                "Fully branded reports with custom visualizations",
                "Custom themes & human-AI hybrid query refinement",
                "Dedicated account manager, 24/7 support",
              ],
            },
          ],
        });

        console.log({schema})

        setBillingConfig(schema);
      } catch (err) {
        console.error("Failed to load billing schema.", err);
        setError("Failed to load billing schema.");
      } finally {
        setLoading(false);
      }
    }

    fetchBillingSchema();
  }, []);

  return { billingConfig, loading, error };
}
