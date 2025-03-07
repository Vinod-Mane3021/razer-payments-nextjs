'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { BillingConfig, getPlanIntervals, getPrimaryLineItem, LineItemSchema } from '@/schema/billing';
import useGetCurrentPlan from '@/hooks/use-get-current-plan';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Separator } from './ui/separator';
import { If } from './if';
import { LineItemDetails } from './line-item-details';
import { Button } from './ui/button';
import { useTranslation } from 'react-i18next';
import { Option, useCreateOrder } from '@/hooks/use-create-order';
import { detectUserCurrency, formatCurrency } from '@/lib/billing';

interface Paths {
  signUp: string;
  return: string;
}

type Interval = 'month' | 'year';

export function PricingTable({
  config,
  paths,
  CheckoutButtonRenderer,
  redirectToCheckout = true,
  displayPlanDetails = true,
  alwaysDisplayMonthlyPrice = true,
}: {
  config: BillingConfig;
  paths: Paths;
  displayPlanDetails?: boolean;
  alwaysDisplayMonthlyPrice?: boolean;
  redirectToCheckout?: boolean;

  CheckoutButtonRenderer?: React.ComponentType<{
    planId: string;
    productId: string;
    highlighted?: boolean;
  }>;
}) {
  const user = {id: "1", name: "vinod", email: 'vinod@gmail.com'}
  const currentPlan = useGetCurrentPlan()
  const router = useRouter()
  const intervals = getPlanIntervals(config).filter(Boolean) as Interval[];
  const [interval, setInterval] = useState(intervals[0]!);
  const { createOrder, data, isLoading } = useCreateOrder()

  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null)


  // open checkout
  const handleOpenCheckout = async (product: ProductType, type: "custom" | "price", productName: string) => {

    console.log({product})

    if(!user?.email || !user?.id) {
      router.push("/auth/sign-in")
      return;
    }

    if(currentPlan == productName) {
      router.push("/dashboard")
      return;
    }

    if(type == "custom") {
      router.push("/contact")
      return;
    }

    const interval = product.items[0]?.price.name.includes("Monthly") ? "month" : 'year' as string
    const description = product.items[0]?.price.product.description;
    const price = product.items[0]?.price.unit_price.amount;

    if(!description || !price) {
      return;
    }

    const planDetails = {
      name: productName,
      description,
      price: Number(price)/100,
      interval: interval,
      currency: product.currency_code,
    }

    setSelectedProduct(product)

    const option: Option = {
      amount: planDetails.price,
      currency: planDetails.currency,
      customer_details: {
        email: user.email,
        name: user.name,
        billing_address: {
          contact: "",
        },
        shipping_address: {
          contact: ""
        },
        contact: ''
      },
    }

    const order = await createOrder({option})

    console.log({
      order_data: order
    })

  };


  return (
    <>
      <div className={'flex flex-col space-y-8 xl:space-y-12'}>
        <div className={'flex justify-center'}>
          {intervals.length > 1 ? (
            <PlanIntervalSwitcher
              intervals={intervals}
              interval={interval}
              setInterval={setInterval}
            />
          ) : null}
        </div>

        <div
          className={
            'flex flex-col items-start space-y-6 lg:space-y-0' +
            ' justify-center lg:flex-row lg:space-x-4'
          }
        >
          {config.products.map((product) => {
            const plan = product.plans.find((plan) => {
              if (plan.paymentType === 'recurring') {
                return plan.interval === interval;
              }

              return plan;
            });

            if (!plan) {
              return null;
            }

            const primaryLineItem = getPrimaryLineItem(config, plan.id);

            if (!plan.custom && !primaryLineItem) {
              throw new Error(`Primary line item not found for plan ${plan.id}`);
            }

            return (
              <PricingItem
                selectable
                key={plan.id}
                plan={{...plan, buttonLabel: (currentPlan == product.name) ? "Your current Plan" : undefined}}
                redirectToCheckout={redirectToCheckout}
                primaryLineItem={primaryLineItem}
                product={product}
                paths={paths}
                displayPlanDetails={displayPlanDetails}
                alwaysDisplayMonthlyPrice={alwaysDisplayMonthlyPrice}
                CheckoutButton={CheckoutButtonRenderer}
                onCheckout={(pro) => handleOpenCheckout(pro, product.type, product.name)}
                type={product.type}
                currentPlan={currentPlan}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

type ProductType = {
  items: {
      quantity: number;
      price: {
          description: string;
          name: string;
          unit_price: {
              amount: string;
              currency_code: string;
          };
          product: {
              name: string;
              tax_category: string;
              description: string;
          };
      };
  }[];
  currency_code: string;
}
function PricingItem(
  props: React.PropsWithChildren<{
    className?: string;
    displayPlanDetails: boolean;

    type: "custom" | "price"

    paths: Paths;

    selectable: boolean;

    currentPlan?: string

    primaryLineItem: z.infer<typeof LineItemSchema> | undefined;

    redirectToCheckout?: boolean;
    alwaysDisplayMonthlyPrice?: boolean;

    plan: {
      id: string;
      lineItems: z.infer<typeof LineItemSchema>[];
      interval?: Interval;
      name?: string;
      href?: string;
      label?: string;
      buttonLabel?: string
    };

    CheckoutButton?: React.ComponentType<{
      planId: string;
      productId: string;
      highlighted?: boolean;
    }>;

    product: {
      id: string;
      name: string;
      currency: string;
      description: string;
      badge?: string;
      highlighted?: boolean;
      features: string[];
    };

    onCheckout: (product: ProductType) => void;
  }>,
) {
  const highlighted = props.product.highlighted ?? false;

  const lineItem = props.primaryLineItem;

  // we exclude flat line items from the details since
  // it doesn't need further explanation
  const lineItemsToDisplay = props.plan.lineItems.filter((item) => {
    return item.type !== 'flat';
  });

  const interval = props.plan.interval as Interval;

  
  const handleCheckout = (product: ProductType) => {
    props.onCheckout(product)
  }


  return (
    <div
      data-cy={'subscription-plan'}
      className={cn(
        props.className,
        `s-full relative flex flex-1 grow flex-col items-stretch justify-between self-stretch rounded-xl border p-8 lg:w-4/12 xl:max-w-[20rem]`,
        {
          ['border-primary']: highlighted,
          ['border-border']: !highlighted,
        },
      )}
    >
      <If condition={props.product.badge}>
        <div className={'absolute -top-2.5 left-0 flex w-full justify-center'}>
          <Badge
            className={highlighted ? '' : 'bg-background'}
            variant={highlighted ? 'default' : 'outline'}
          >
            <span>
              {props.product.badge}
            </span>
          </Badge>
        </div>
      </If>

      <div className={'flex flex-col space-y-6'}>
        <div className={'flex flex-col space-y-2.5'}>
          <div className={'flex items-center space-x-6'}>
            <b
              className={
                'text-current-foreground font-heading font-semibold uppercase tracking-tight'
              }
            >
              {props.product.name}
            </b>
          </div>

          <span className={cn(`text-muted-foreground h-6 text-sm`)}>
            {props.product.description}
          </span>
        </div>

        <Separator />

        <div className={'flex flex-col space-y-2'}>

          <If condition={props.type == "price"}>
            <Price isMonthlyPrice={props.alwaysDisplayMonthlyPrice}>
              <LineItemPrice
                plan={props.plan}
                product={props.product}
                interval={interval}
                lineItem={lineItem}
                alwaysDisplayMonthlyPrice={props.alwaysDisplayMonthlyPrice}
              />
            </Price>
          </If>

          <If condition={props.type == "custom"}>
            <div className='font-heading flex items-center text-3xl font-semibold tracking-tighter'>Custom Pricing</div> 
          </If>

          <If condition={props.plan.name}>
            <span
              className={cn(
                `animate-in slide-in-from-left-4 fade-in text-muted-foreground flex items-center space-x-0.5 text-sm capitalize`,
              )}
            >
              <span>
                <If
                  condition={props.plan.interval}
                  fallback={"Lifetime"}
                >
                  {(interval) => (
                    interval == "month" ? "Billed monthly" : "Billed yearly"
                  )}
                </If>
              </span>

              <If condition={lineItem && lineItem?.type !== 'flat'}>
                <span>/</span>

                <span
                  className={cn(
                    `animate-in slide-in-from-left-4 fade-in text-sm capitalize`,
                  )}
                >
                  <If condition={lineItem?.type === 'per_seat'}>
                    Per team member
                  </If>

                  <If condition={lineItem?.unit}>
                      Per {lineItem?.unit} usage
                  </If>
                </span>
              </If>
            </span>
          </If>
        </div>


        <If condition={props.selectable}>
          <If
            condition={props.plan.id && props.CheckoutButton}
            fallback={
              <DefaultCheckoutButton
                paths={props.paths}
                product={props.product}
                highlighted={highlighted}
                plan={props.plan}
                redirectToCheckout={props.redirectToCheckout}
                currentPlan={props.currentPlan}
                onClick={(e) => {
                  e.preventDefault();
                  const convert = (input: number) => Math.round(input * 100);
                  const product: ProductType = {
                    items: [
                      {
                        quantity: 1,
                        price: {
                          description: props.plan.name ? props.plan.name : "",
                          name: props.plan.name ? props.plan.name : "",
                          unit_price: {
                            amount: props.plan.lineItems[0]?.cost ? String(convert(props.plan.lineItems[0]?.cost)) : "",
                            currency_code: props.product.currency,
                          },
                          product: {
                            name: props.product.name,
                            tax_category: "standard",
                            description: props.product.description,
                          },
                        },
                      },
                    ],
                    currency_code: "USD",
                  };
                  handleCheckout(product)
                }}
              />
            }
          >
            {(CheckoutButton) => (
              <CheckoutButton
                highlighted={highlighted}
                planId={props.plan.id}
                productId={props.product.id}
              />
            )}
          </If>
        </If>

        <Separator />

        <div className={'flex flex-col'}>
          <FeaturesList
            highlighted={highlighted}
            features={props.product.features}
          />
        </div>

        <If condition={props.displayPlanDetails && lineItemsToDisplay.length}>
          <Separator />

          <div className={'flex flex-col space-y-2'}>
            <h6 className={'text-sm font-semibold'}>
                Details
            </h6>

            <LineItemDetails
              selectedInterval={props.plan.interval}
              currency={props.product.currency}
              lineItems={lineItemsToDisplay}
            />
          </div>
        </If>
      </div>
    </div>
  );
}

function FeaturesList(
  props: React.PropsWithChildren<{
    features: string[];
    highlighted?: boolean;
  }>,
) {
  return (
    <ul className={'flex flex-col space-y-2'}>
      {props.features.map((feature) => {
        return (
          <ListItem key={feature}>
            {feature}
          </ListItem>
        );
      })}
    </ul>
  );
}

function Price({
  children,
  isMonthlyPrice = true,
}: React.PropsWithChildren<{
  isMonthlyPrice?: boolean;
}>) {
  return (
    <div
      className={`animate-in slide-in-from-left-4 fade-in flex items-end gap-2 duration-500`}
    >
      <span
        className={
          'font-heading flex items-center text-3xl font-semibold tracking-tighter'
        }
      >
        {children}
      </span>

      <If condition={isMonthlyPrice}>
        <span className={'text-muted-foreground text-sm leading-loose'}>
          per month
        </span>
      </If>
    </div>
  );
}

function ListItem({ children }: React.PropsWithChildren) {
  return (
    <li className={'flex items-center space-x-2.5'}>
      <CheckCircle className={'text-primary h-4 min-h-4 w-4 min-w-4'} />

      <span
        className={cn('text-sm', {
          ['text-secondary-foreground']: true,
        })}
      >
        {children}
      </span>
    </li>
  );
}

function PlanIntervalSwitcher(
  props: React.PropsWithChildren<{
    intervals: Interval[];
    interval: Interval;
    setInterval: (interval: Interval) => void;
  }>,
) {
  return (
    <div className={'flex'}>
      {props.intervals.map((plan, index) => {
        const selected = plan === props.interval;

        const className = cn(
          'focus:!ring-0 !outline-none animate-in transition-all fade-in',
          {
            'rounded-r-none border-r-transparent': index === 0,
            'rounded-l-none': index === props.intervals.length - 1,
            ['hover:text-primary border text-muted-foreground']: !selected,
            ['font-semibold cursor-default hover:text-initial hover:bg-background']:
              selected,
          },
        );

        return (
          <Button
            key={plan}
            variant={'outline'}
            className={className}
            onClick={() => props.setInterval(plan)}
          >
            <span className={'flex items-center space-x-1'}>
              <If condition={selected}>
                <CheckCircle className={'animate-in fade-in zoom-in-90 h-4'} />
              </If>

              <span className={'capitalize'}>
                {plan == "month" && "Billed monthly"}
                {plan == "year" && "Billed yearly"}
              </span>
            </span>
          </Button>
        );
      })}
    </div>
  );
}

function DefaultCheckoutButton(
  props: React.PropsWithChildren<{
    plan: {
      id: string;
      name?: string | undefined;
      href?: string;
      buttonLabel?: string;
    };

    currentPlan?: string

    product: {
      name: string;
    };

    paths: Paths;
    redirectToCheckout?: boolean;

    highlighted?: boolean;

    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  }>,
) {
  const { t } = useTranslation('billing');

  const label = props.plan.buttonLabel ?? 'Get Started with {{plan}}'
  const name = props.product.name

  return (
      <Button
        size={'lg'}
        className={'border-primary w-full rounded-lg border'}
        variant={props.highlighted ? 'default' : 'outline'}
        onClick={props.onClick}
      >
        <span>
          <p>
            {label.replace("{{plan}}", t(name, { defaultValue: name }))}
          </p>
        </span>

        <ArrowRight className={'ml-2 h-4'} />
      </Button>
  );
}

const LineItemPrice = ({
    plan,
    lineItem,
    alwaysDisplayMonthlyPrice,
    interval
  }: {
    lineItem: z.infer<typeof LineItemSchema> | undefined;
    plan: {
      label?: string;
    };
    interval: Interval | undefined;
    product: {
      currency: string;
    };
    alwaysDisplayMonthlyPrice?: boolean;
  }) => {
  const [price, setPrice] = useState<string | null>(null);
  const isYearlyPricing = interval === 'year';

  useEffect(() => {
    // Detect locale and currency on the client only
    if(!lineItem?.cost) return;
      const cost = lineItem
    ? isYearlyPricing
      ? alwaysDisplayMonthlyPrice
        ? Number(lineItem.cost / 12).toFixed(2)
        : lineItem.cost
      : lineItem?.cost
    : 0;
    const locale = navigator.language;
    const currency = detectUserCurrency();
    const formattedPrice = formatCurrency({
      currencyCode: currency,
      value: cost,
      locale: locale,
    });
    setPrice(formattedPrice);
  }, [alwaysDisplayMonthlyPrice, isYearlyPricing, lineItem]);

  if (!price) return null; // Render nothing on the server

  console.log({price})

  return <span>{price}</span>;
};

// function LineItemPrice({
//   lineItem,
//   plan,
//   interval,
//   product,
//   alwaysDisplayMonthlyPrice = true,
// }: {
//   lineItem: z.infer<typeof LineItemSchema> | undefined;
//   plan: {
//     label?: string;
//   };
//   interval: Interval | undefined;
//   product: {
//     currency: string;
//   };
//   alwaysDisplayMonthlyPrice?: boolean;
// }) {
//   const { i18n } = useTranslation();
//   const isYearlyPricing = interval === 'year';

//   const cost = lineItem
//     ? isYearlyPricing
//       ? alwaysDisplayMonthlyPrice
//         ? Number(lineItem.cost / 12).toFixed(2)
//         : lineItem.cost
//       : lineItem?.cost
//     : 0;

//   const costString =
//     lineItem &&
//     formatCurrency({
//       currencyCode: product.currency,
//       locale: i18n.language,
//       value: cost,
//     });

//   const labelString = plan.label && (
//     plan.label
//   );

//   return costString ?? labelString ?? "Custom";
// }


