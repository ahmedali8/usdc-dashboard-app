import { getHoldersCount } from "@/lib/mongo/controller/holders";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { holdersCount, error } = await getHoldersCount();
    if (error) throw new Error(error);

    return NextResponse.json(holdersCount);
  } catch {
    return NextResponse.json("error", {
      status: 500,
    });
  }
}
