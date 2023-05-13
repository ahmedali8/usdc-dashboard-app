import { getHolders } from "@/lib/mongo/controller/holders";
import { DEFAULT_N_PER_PAGE, DEFAULT_PAGE_NUMBER } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  let pageNumber: number = DEFAULT_PAGE_NUMBER;
  let nPerPage: number = DEFAULT_N_PER_PAGE;

  try {
    const url = request.nextUrl;

    if (url.searchParams.has("pageNumber")) {
      pageNumber = Number(url.searchParams.get("pageNumber")!);
    }

    if (url.searchParams.has("nPerPage")) {
      nPerPage = Number(url.searchParams.get("nPerPage")!);
    }

    const { holders, error } = await getHolders(pageNumber, nPerPage);
    if (error) throw new Error(error);

    return NextResponse.json(holders);
  } catch {
    return NextResponse.json("error", {
      status: 500,
    });
  }
}
