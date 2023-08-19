import { stripe } from "@/lib/stripe";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

const handler = async (req: NextRequest, res: NextApiResponse) => {
  console.log(req);

  const api_key = req.nextUrl.searchParams.get("api_key");
  console.log(api_key);
  if (!api_key) {
    return NextResponse.json("must have api key");
  }

  const user = await prisma.user.findFirst({
    where: {
      api_key: api_key as string,
    },
  });

  if (!user) {
    return NextResponse.json("no user with api key");
  }

  const customer = await stripe.customers.retrieve(
    String(user?.stripe_customer_id)
  );

  const subscriptions = await stripe.subscriptions.list({
    customer: String(user?.stripe_customer_id),
  });

  const item = subscriptions.data.at(0)?.items.data.at(0);

  if (!item) {
    return NextResponse.json("you have no subscription");
  }

  const result = await stripe.subscriptionItems.createUsageRecord(
    String(item?.id),
    {
      quantity: 1,
    }
  );

  const log = await prisma.log.create({
    data: {
      userId: user.id,
      status: 200,
      method: "GET",
    },
  });
  const data = randomUUID();
  return NextResponse.json({ specialKey: data, log: log });
};

export { handler as GET, handler as POST };
