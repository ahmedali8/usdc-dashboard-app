import { handleEvents } from "@/lib/events";
import { connectToDatabase } from "@/lib/mongoose";
import { LastBlock, ILastBlock } from "@/lib/mongoose/Models";
import { NextResponse } from "next/server";

connectToDatabase();

export async function GET() {
  try {
    // const lastBlock = await LastBlock.find();
    // console.log("lastBlock: ", lastBlock);

    console.log("hi");

    await handleEvents();

    return NextResponse.json({});
  } catch {
    return NextResponse.json("error", {
      status: 500,
    });
  }
}
