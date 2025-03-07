// import { convertToLocalCurrency, detectUserCurrency, getLocaleForCurrency } from "@/lib/utils";
// import { createBillingSchema, ProductSchema } from "@/schema/billing";
// import { formatCurrency } from "@/lib/utils"; // Assuming you have a formatCurrency utility

// // Base prices in USD
// const baseProducts: ProductSchema[] = [
//   // Starter
//   {
//     id: "starter",
//     name: "Starter",
//     description: "The perfect plan to get started",
//     badge: `Value`,
//     currency: "USD",
//     plans: [
//       {
//         name: "Starter Monthly",
//         id: "starter-monthly",
//         paymentType: "recurring",
//         interval: "month",
//         lineItems: [
//           {
//             id: "pri_01ja7smmrwdfw3w4stkt4bm03v",
//             name: "Starter",
//             cost: 5.99, // USD
//             type: "flat" as const,
//           },
//         ],
//       },
//       {
//         name: "Starter Yearly",
//         id: "starter-yearly",
//         paymentType: "recurring",
//         interval: "year",
//         lineItems: [
//           {
//             id: "pri_01ja7spbegts542cctrhanvqt5",
//             name: "Base",
//             cost: 59.9, // USD
//             type: "flat" as const,
//           },
//         ],
//       },
//     ],
//     type: "price",
//     features: [
//       "5 files/month",
//       "10 MB per document",
//       "Basic insights: Totals, averages, trends",
//       "Standard templates",
//       "Predefined themes only",
//       "Community-based, 48-hour email response",
//     ],
//   },
//   // Pro
//   {
//     id: "pro",
//     name: "Pro",
//     badge: `Popular`,
//     highlighted: true,
//     description: "The perfect plan for professionals",
//     currency: "USD",
//     plans: [
//       {
//         name: "Pro Monthly",
//         id: "pro-monthly",
//         paymentType: "recurring",
//         interval: "month",
//         lineItems: [
//           {
//             id: "pri_01ja7ssjnb9czx6ktw9h4a1ztt",
//             name: "Base",
//             cost: 19.99,
//             type: "flat",
//           },
//         ],
//       },
//       {
//         name: "Pro Yearly",
//         id: "pro-yearly",
//         paymentType: "recurring",
//         interval: "year",
//         lineItems: [
//           {
//             id: "pri_01ja7stacgz4q0q6jvgtnvx9a4",
//             name: "Base",
//             cost: 199.99,
//             type: "flat",
//           },
//         ],
//       },
//     ],
//     type: "price",
//     features: [
//       "10 files/month",
//       "50MB per document",
//       "Advanced AI insights: Trends, forecasts, anomalies",
//       "Customizable templates (branding options)",
//       "All themes & unlimited queries",
//       "Priority email, 24-hour response",
//     ],
//   },
//   // Enterprise
//   {
//     id: "enterprise",
//     name: "Enterprise",
//     description: "The perfect plan for enterprises",
//     currency: "USD",
//     plans: [
//       {
//         name: "Enterprise Monthly",
//         id: "enterprise-monthly",
//         paymentType: "recurring",
//         interval: "month",
//         lineItems: [
//           {
//             id: "pri_01ja7sw35ywx0ske3mc7nby46z",
//             name: "Base",
//             cost: 29.99,
//             type: "flat",
//           },
//         ],
//       },
//       {
//         name: "Enterprise Yearly",
//         id: "enterprise-yearly",
//         paymentType: "recurring",
//         interval: "year",
//         lineItems: [
//           {
//             id: "pri_01ja7sx131806nzprpw6dxwvkk",
//             name: "Base",
//             cost: 299.9,
//             type: "flat",
//           },
//         ],
//       },
//     ],
//     type: "custom",
//     features: [
//       "Custom # file/months",
//       "Custom MB per document",
//       "Fully tailored AI insights: predictive analytics, segmentation",
//       "Fully branded reports with custom visualizations",
//       "Custom themes & human-AI hybrid query refinement",
//       "Dedicated account manager, 24/7 support",
//     ],
//   },
// ];





// // Get localized prices for products
// const getLocalizedProducts = async (
//   baseProducts: ProductSchema[],
//   currency: string
// ): Promise<ProductSchema[]> => {
//   const localizedProducts = await Promise.all(
//     baseProducts.map(async (product) => {
//       const localizedPlans = await Promise.all(
//         product.plans.map(async (plan) => {
//           const localizedLineItems = await Promise.all(
//             plan.lineItems.map(async (item) => {
//               const localCost = await convertToLocalCurrency(item.cost, currency);
//               const locale = getLocaleForCurrency(currency); // Get locale for the currency
//               return {
//                 ...item,
//                 cost: localCost,
//                 formattedCost: formatCurrency({
//                   currencyCode: currency,
//                   value: localCost,
//                   locale: locale, // Pass the correct locale
//                 }),
//               };
//             })
//           );
//           return {
//             ...plan,
//             lineItems: localizedLineItems,
//           };
//         })
//       );
//       return {
//         ...product,
//         currency,
//         plans: localizedPlans,
//       };
//     })
//   );
//   return localizedProducts;
// };

// // Create billing schema with localized prices
// export default async function createLocalizedBillingSchema() {
//   const currency = detectUserCurrency(); // Detect user's currency
//   const localizedProducts = await getLocalizedProducts(baseProducts, currency);

//   return createBillingSchema({
//     provider: "razorpay",
//     products: localizedProducts,
//   });
// }

