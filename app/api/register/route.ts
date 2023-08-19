import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

const handler = async (req: NextApiRequest) => {
  return NextResponse.json("hello");
};

export { handler as GET, handler as POST };
