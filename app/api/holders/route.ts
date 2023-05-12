import { connectToDatabase } from "@/lib/mongoose";
import { Holder } from "@/lib/mongoose/Models";
import { NextResponse } from "next/server";

connectToDatabase();

export async function GET() {
  try {
    const holders = await Holder.find();
    // console.log("holders: ", holders);
    return NextResponse.json(holders);
  } catch {
    return NextResponse.json("error", {
      status: 500,
    });
  }
}
