import Header from "@/components/Header";
import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe("sk_test_...", {
  apiVersion: "2023-08-16",
});

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);

  if (session) {
    console.log("logged in");
  } else {
    redirect("/api/auth/signin");
  }

  return (
    <div>
      <Header />
      <div className="max-w-5xl m-auto w-full px-4">{children}</div>
    </div>
  );
};

export default layout;
