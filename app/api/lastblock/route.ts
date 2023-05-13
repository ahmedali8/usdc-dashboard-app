import { getLastBlock } from "@/lib/mongo/controller/lastBlock";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { lastBlock, error } = await getLastBlock();
    if (error) throw new Error(error);

    return NextResponse.json(lastBlock, {
      status: 200,
    });
  } catch {
    return NextResponse.json("error", {
      status: 500,
    });
  }
}
