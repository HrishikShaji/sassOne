import Header from "@/components/Header";
import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import { mustBeLoggedIn } from "@/lib/auth";
import {
  createCheckoutLink,
  createCustomerIfNull,
  hasSubscription,
} from "@/lib/stripe";

const layout = async ({ children }: { children: React.ReactNode }) => {
  await mustBeLoggedIn();

  return (
    <div>
      <Header />
      <div className="max-w-5xl m-auto w-full px-4">{children}</div>
    </div>
  );
};

export default layout;
