import {
  createCheckoutLink,
  createCustomerIfNull,
  hasSubscription,
  stripe,
} from "@/lib/stripe";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import Link from "next/link";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

const page = async () => {
  const session = await getServerSession(authOptions);
  const hasSub = await hasSubscription();
  const customer = await createCustomerIfNull();
  const checkoutLink = await createCheckoutLink(customer as string);
  console.log(checkoutLink);

  const user = await prisma.user.findFirst({
    where: {
      email: session?.user?.email,
    },
  });

  const top10RecentLogs = await prisma.log.findMany({
    where: {
      userId: user?.id,
    },
    orderBy: {
      created: "desc",
    },
    take: 10,
  });

  let current_usage = 0;

  if (hasSub) {
    const subscriptions = await stripe.subscriptions.list({
      customer: String(user?.stripe_customer_id),
    });
    const invoice = await stripe.invoices.retrieveUpcoming({
      subscription: subscriptions.data.at(0)?.id,
    });

    current_usage = invoice.amount_due;
  }

  return (
    <main>
      {hasSub ? (
        <>
          <div>
            <div className="px-4 py-2 bg-teal-500 font-medium text-white">
              <h1>You have subscription</h1>
            </div>
            <div className="divide-y divide-zinc-200 border border-zinc-300">
              <p className="text-sm text-black">Current Usage</p>
              <p>{current_usage / 100}</p>
            </div>
            <div className="divide-y divide-zinc-200 border border-zinc-300">
              <p className="text-sm text-black">API key</p>
              <Link
                href={`/api/endpoint?api_key=${user?.api_key}`}
                className="text-sm font-mono text-ainc-500 px-6 py-4">
                {user?.api_key}
              </Link>
            </div>
            <div className="divide-y divide-zinc-200 border border-zinc-300">
              <p className="text-sm text-black">Top 10 log Events</p>
              <div className="text-sm font-mono text-ainc-500 px-6 py-4">
                {top10RecentLogs.map((log) => (
                  <div key={log.id} className="flex gap-4">
                    <p>{log.method}</p>
                    <p>{log.status}</p>
                    <p>{log.created.toDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
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
