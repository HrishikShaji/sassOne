import {
  createCheckoutLink,
  createCustomerIfNull,
  hasSubscription,
} from "@/lib/stripe";
import Link from "next/link";
import React from "react";

const page = async () => {
  const hasSub = await hasSubscription();
  const customer = await createCustomerIfNull();
  const checkoutLink = await createCheckoutLink(customer as string);
  console.log(checkoutLink);
  return (
    <main>
      {hasSub ? (
        <>
          <div className="px-4 py-2 bg-teal-500 font-medium text-white">
            <h1>You have subscription</h1>
          </div>
        </>
      ) : (
        <>
          <div className="min-h-[60vh] grid place-items-center rounded-lg px-6 py-10 bg-neutral-500">
            <Link
              href={checkoutLink as string}
              className="font-medium text-sm hover:underline">
              You have no subscription ,Checkout now
            </Link>
          </div>
        </>
      )}
    </main>
  );
};

export default page;
